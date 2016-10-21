using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace Maginco.Models
{
    public class RegisterModel
    {
        public RegisterModel()
        {
            firstName = lastName = middleName = contactNumber = addressLine1
                = addressLine2 = addressLine3 = postCode = country
                = companyName = companyWebsite = String.Empty;

            accountExpireDate = DateTime.Now.AddMonths(3).ToShortDateString();
        }

        [DisplayName("First Name")]
        public string firstName { get; set; }

        [DisplayName("Middle Name")]
        public string middleName { get; set; }

        [DisplayName("Last Name")]
        public string lastName { get; set; }

        [DisplayName("Contact Number")]
        public string contactNumber { get; set; }

        [DisplayName("Address Line 1")]
        public string addressLine1 { get; set; }

        [DisplayName("Address Line 2")]
        public string addressLine2 { get; set; }

        [DisplayName("Address Line 3")]
        public string addressLine3 { get; set; }

        [DisplayName("Post Code")]
        public string postCode { get; set; }

        [DisplayName("Country")]
        public string country { get; set; }

        [DisplayName("Email Address")]
        public string emailAddress { get; set; }

        [DisplayName("Password")]
        public string password { get; set; }

        [DisplayName("Company Name")]
        public string companyName { get; set; }

        [DisplayName("Company Website")]
        public string companyWebsite { get; set; }
        
        public string accountExpireDate { get; set; }
    }
}