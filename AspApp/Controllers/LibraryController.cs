using Microsoft.AspNetCore.Mvc;

namespace AspApp.Controllers;

[ApiController]
[Route("/api/[controller]/[action]")]
public class LibraryController : ControllerBase
{
    public LibraryController()
    {

    }
}