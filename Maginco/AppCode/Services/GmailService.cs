using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Web;

namespace Maginco.AppCode.Services
{
    public class GmailService : SmtpClient
    {
        public string UserName { get; set; }

        public GmailService()
        {
            UserName = "magincocontact@gmail.com";
            EnableSsl = true;
            UseDefaultCredentials = false;
            Host = "smtp.gmail.com";
            Port = 587;
            Credentials = new System.Net.NetworkCredential(UserName, "maginco123");
        }
    }
}