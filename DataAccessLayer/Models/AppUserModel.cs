using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Models
{
    public class AppUserModel : IdentityUser
    {
        //returning email as username only to supress ASP.NET identiry error for requiring username
        public override string UserName { get { return emailAddress; } set { return; } }
        public string accountExpireDate { get; set; }
        public string firstName { get; set; }
        public string middleName { get; set; }
        public string lastName { get; set; }
        public string emailAddress { get; set; }
        public string contactNumber { get; set; }
        public string addressLine1 { get; set; }
        public string addressLine2 { get; set; }
        public string addressLine3 { get; set; }
        public string postCode { get; set; }
        public string country { get; set; }
        public string password { get; set; }
        public string companyName { get; set; }
        public string companyWebsite { get; set; }

        public virtual ICollection<Chart> Charts { get; set; }
    }
}
