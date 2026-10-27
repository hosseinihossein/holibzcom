// NatsSubscriber.cs
using NATS.Client.Core;

public class NatsSubscriber : BackgroundService
{
    private readonly INatsClient _client;
    private readonly ILogger<NatsSubscriber> _logger;
    private readonly string _subject;

    public NatsSubscriber(
        INatsClient client,
        ILogger<NatsSubscriber> logger,
        IConfiguration configuration)
    {
        _client = client;
        _logger = logger;
        _subject = configuration["NATS:LogSubject"] ?? "log";
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("NATS Subscriber Worker is starting...");

        // Set up the async stream subscription
        await foreach (var msg in _client.SubscribeAsync<MyMessage>(subject: _subject, cancellationToken: stoppingToken))
        {
            try
            {
                var data = msg.Data;
                _logger.LogInformation("Received Order ID: {Id}, Details: {Details}", data?.Id, data?.Details);

                // Process your business logic here...
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing NATS message.");
            }
        }
    }
}
