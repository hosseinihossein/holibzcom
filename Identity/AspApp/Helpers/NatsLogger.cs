using System.Collections.Concurrent;
using AspApp.Models;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using NATS.Client.Core;

namespace AspApp.Helpers;

public class NatsLogger : ILogger
{
    private readonly string _categoryName;
    private readonly INatsClient _natsClient;
    private readonly NatsSubjects _subjects;

    public NatsLogger(string categoryName, INatsClient natsClient, NatsSubjects subjectsOptions)
    {
        _categoryName = categoryName;
        _natsClient = natsClient;
        _subjects = subjectsOptions;
    }

    public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

    public bool IsEnabled(LogLevel logLevel) => logLevel != LogLevel.None;

    public void Log<TState>(
        LogLevel logLevel,
        EventId eventId,
        TState state,
        Exception? exception,
        Func<TState, Exception?, string> formatter)
    {
        if (!IsEnabled(logLevel)) return;

        // 1. Format the message
        string message = formatter(state, exception);

        // 2. Build a structured payload
        var payload = new NatsLogPayload(
            CategoryName: _categoryName,
            LogLevel: logLevel.ToString(),
            //EventId: eventId.Id,
            Message: message,
            Exception: exception?.ToString(),
            Timestamp: DateTime.UtcNow
        );

        // Fire-and-forget publishing to avoid freezing synchronous logger calling threads
        Task.Run(async () =>
        {
            try
            {
                // 3. Produce the message to the Nats subject
                await _natsClient.PublishAsync(_subjects.LogSubject, payload);
            }
            catch (Exception ex)
            {
                // Fallback: Prevent logger exceptions from crashing your primary application
                Console.Error.WriteLine($"[NatsLogger Error] Failed to send log to Nats:\n{ex.Message}");
            }
        });
    }
}

[ProviderAlias("Nats")]
public class NatsLoggerProvider : ILoggerProvider
{
    private readonly INatsClient _natsClient;
    private readonly NatsSubjects _subjects;
    private readonly ConcurrentDictionary<string, NatsLogger> _loggers = new();

    public NatsLoggerProvider(INatsClient natsClient, IOptions<NatsSubjects> subjectsOptions)
    {
        _natsClient = natsClient;
        _subjects = subjectsOptions.Value;
    }

    public ILogger CreateLogger(string categoryName)
    {
        return _loggers.GetOrAdd(categoryName, categoryName => new NatsLogger(categoryName, _natsClient, _subjects));
    }

    public void Dispose()
    {
        // Connection lifespan is managed by the core AddNatsClient DI handler
    }
}

public static class NatsLoggerExtensions
{
    public static ILoggingBuilder AddNats(this ILoggingBuilder builder)
    {
        // Register the provider safely inside the Microsoft logging pipeline
        builder.Services.TryAddEnumerable(
            ServiceDescriptor.Singleton<ILoggerProvider, NatsLoggerProvider>()
        );

        return builder;
    }
}

public record NatsLogPayload(
    string CategoryName,
    string LogLevel,
    //int EventId,
    string Message,
    string? Exception,
    DateTime Timestamp
);

