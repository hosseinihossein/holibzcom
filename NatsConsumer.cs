using AspApp.Models;
using Microsoft.Extensions.Options;
using NATS.Client.JetStream;
using NATS.Client.JetStream.Models;

namespace AspApp.Helpers;

public class NatsConsumer : BackgroundService
{
    private readonly INatsJSContext _jsContext;
    private readonly ILogger<NatsConsumer> _logger;
    private readonly NatsSubjects _natsSubjetcs;
    private readonly string _streamName;
    private const string _durableName = "new-user-consumer";

    public NatsConsumer(INatsJSContext jsContext, ILogger<NatsConsumer> logger,
    IOptions<NatsSubjects> natsSubjects, IOptions<NatsStreams> natsStreams)
    {
        _jsContext = jsContext;
        _logger = logger;
        _natsSubjetcs = natsSubjects.Value;
        _streamName = natsStreams.Value.UserAccount;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Bind or create a durable consumer tracking system
        var consumer = await _jsContext.CreateOrUpdateConsumerAsync(
            stream: _streamName,
            config: new ConsumerConfig(_durableName)
            {
                // Crucial for 'limits': Giving it a name makes it durable.
                // If the app restarts, NATS remembers exactly which message it left off on.
                DurableName = _durableName,
                AckPolicy = ConsumerConfigAckPolicy.Explicit,
                // remove the filter for all subjects under the stream
                FilterSubject = _natsSubjetcs.CreateUserAccount
            },
            cancellationToken: stoppingToken
        );

        _logger.LogInformation("Durable consumer registered. Processing stream...");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await foreach (var msg in consumer.ConsumeAsync<MessageData>(cancellationToken: stoppingToken))
                {
                    _logger.LogInformation("Processing event: {UserId}", msg.Data?.Id);

                    // Business logic here...

                    // Acknowledging tells NATS this consumer has processed this sequence,
                    // but the message remains in the stream for OTHER consumers to read.
                    await msg.AckAsync(cancellationToken: stoppingToken);
                }
            }
            catch (Exception ex) when (!stoppingToken.IsCancellationRequested)
            {
                _logger.LogError(ex, "Transient processing error. Retrying stream chunk...");
                await Task.Delay(2000, stoppingToken);
            }
        }
    }
}

class MessageData
{
    public Guid Id { get; set; }
    public DateTime CreatedAt { get; set; }
}

