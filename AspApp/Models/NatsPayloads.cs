namespace AspApp.Models;

public record Nats_CreateUserAccount_Payload(
    Guid Id,
    DateTime CreatedAt,
    string? RemoteAvatarUrl
);