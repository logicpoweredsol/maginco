using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;

namespace Maginco.AppCode.Services
{
    public class EmailService : IIdentityMessageService
    {
        public async Task SendAsync(IdentityMessage emailMessage)
        {
            MailMessage msg = new MailMessage();
            
            msg.To.Add(emailMessage.Destination);
            //msg.To.Add("syed.ali@logicpowered.net");


            msg.From = new MailAddress("noreply@maginco.com");
            msg.Subject = emailMessage.Subject;
            msg.Body = emailMessage.Body;
            msg.IsBodyHtml = true;

            using (var mailClient = new GmailService())
            {
                await mailClient.SendMailAsync(msg);
            }
        }
    }
}