namespace AspApp.Models;

public class MainConfigs
{
    public string? MainDomainName { get; set; }
}

public class NatsSubjects
{
    //public string Log { get; set; } = string.Empty;
    //public string Email { get; set; } = string.Empty;
    public string CreateUserAccount { get; set; } = string.Empty;
    public string DeleteUserAccount { get; set; } = string.Empty;
}

public class NatsStreams
{
    public string UserAccount { get; set; } = string.Empty;
}

public class TurnstileConfigs
{
    public bool Enabled { get; set; }
    public string SecretKey { get; set; } = string.Empty;
}