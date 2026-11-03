using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace AspApp.Controllers;

[ApiController]
[Route("/api/[controller]/[action]")]
public class UserAccountController : ControllerBase
{
    public UserAccountController()
    {

    }


    // ********** Profile **********
    [HttpGet]
    public async Task<IActionResult> GetProfileInfo([FromQuery][StringLength(36)] string userId)
    {

    }

    [HttpGet]
    public async Task<IActionResult> GetUserAvatarUrl([FromQuery][StringLength(36)] string userId)
    {

    }



}