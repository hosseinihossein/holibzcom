using System.Text.Json;
using AspApp.Models;
using Microsoft.Extensions.Options;
using NATS.Client.Core;

namespace AspApp.Helpers;

public class NatsEmailSender
{
    private readonly INatsClient _natsClient;
    private readonly NatsSubjects _subjects;
    private readonly ILogger<NatsEmailSender> _logger;


    public NatsEmailSender(INatsClient natsClient, IOptions<NatsSubjects> natsSubjects,
    ILogger<NatsEmailSender> logger)
    {
        _natsClient = natsClient;
        _subjects = natsSubjects.Value;
        _logger = logger;
    }


    public void Send(EmailModel emailModel)
    {
        Task.Run(async () =>
        {
            try
            {
                await _natsClient.PublishAsync(_subjects.Log, emailModel);
            }
            catch (Exception e)
            {
                _logger.LogWarning($"Exception happened while sending email to Nats: {e}");
            }
        });
    }


}

public class EmailModel
{
    public string? ReceiverName { get; set; } = "User";
    public string ReceiverEmail { get; set; } = null!;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}