using System.ComponentModel.DataAnnotations;
using AspApp.Helpers;

namespace AspApp.Models;

public class Authentication_Login_FormModel : ITurnstileModel
{
    public string? ReturnUrl { get; set; }

    [StringLength(128, MinimumLength = 3)]
    public string UsernameOrEmail { get; set; } = string.Empty;

    [StringLength(60, MinimumLength = 8)]
    public string Password { get; set; } = string.Empty;

    [StringLength(2048)]
    public string? CfTurnstileResponse { get; set; }
}

public class Authentication_LoginWithProvider_FormModel : ITurnstileModel
{
    public string? ReturnUrl { get; set; }

    [StringLength(2048)]
    public string? CfTurnstileResponse { get; set; }
}