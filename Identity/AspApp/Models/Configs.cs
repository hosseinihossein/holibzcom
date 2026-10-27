namespace AspApp.Models;

public class NatsSubjects
{
    public string Log { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string CreateUserAccount { get; set; } = string.Empty;
    public string DeleteUserAccount { get; set; } = string.Empty;
}

public class NatsStreams
{
    public string UserAccount { get; set; } = string.Empty;
}