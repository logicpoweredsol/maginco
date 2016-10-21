using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Maginco.AppCode
{
    public class AppConsts
    {
        private AppConsts() { }

        public enum AppRoles
        {
            ADMIN,
            FREEMIUM,
            PREMIUM
        }

        public enum AppClaims
        {
            ComapnyName,
        }

        public class EmailTexts
        {
            private EmailTexts() { }

            public static string GetNewAccountText(string username, string callbackUrl)
            {
                string url = String.Concat("<a href='", callbackUrl, "'>Activation Link</a>");
                string str = String.Format("Dear {0}, Thank you for creating a new account with Maginco.com. In order to fully activate your account please click on the confirmation link below. If you have any issues or questions please email us support@maginco.com <br> {1}", username, url);

                return str;
            }
            
            public static string GetAccountWelcomeText(string username)
            {
                string str = String.Format("Dear {0}, Thank you for verifiying your account. Your account has been fully as 'Freemium' Account. You may now login and create charts. <br> If you have any issues or questions please email us support@maginco.com or please refer to our Help and Documentation section available in the customer dashboard area.", username);

                return str;
            }

            public static string GetEmailUpdateText(string username, string callbackUrl)
            {
                string url = String.Concat("<a href='", callbackUrl, "'>Activation Link</a>");
                string str = String.Format("Dear {0}, An email request change was recently requested from your account. To Verify your new email address please click on the link below: If you have any issues or questions please email us support@maginco.com <br> {1}", username, url);

                return str;
            }

            public static string GetAccountUpgradeText(string username, string expirationDate)
            {
                string str = String.Format("Dear {0}, Thank you for upgrading your account. Your account has been upgraded as 'Premium' Account. Your Subscription expires on <b>{1}</b>. If you have any issues or questions please email us at support@maginco.com", username, expirationDate);

                return str;
            }
        }
    }
}