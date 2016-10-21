using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Maginco.Models
{
    public class DashboardModel : ClaimsModel
    {
        public string companyName { get; set; }
        public string accountExpireDate { get; set; }
    }
}