using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Maginco.Models
{
    public class LoginModel
    {
        public string email { get; set; }
        public string password { get; set; }
        public string returnUrl { get; set; }
        public bool rememberMe { get; set; }
    }
}