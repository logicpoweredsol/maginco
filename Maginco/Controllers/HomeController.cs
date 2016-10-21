using DataAccessLayer.Entities;
using DataAccessLayer.Models;
using DataAccessLayer.Repositories;
using Maginco.AppCode.Auth;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace Maginco.Controllers
{
    [AllowAnonymous]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        
        public ActionResult Pricing()
        {
            return View();
        }
    }
}