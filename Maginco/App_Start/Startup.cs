using Microsoft.AspNet.Identity;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.DataProtection;
using Owin;
using Owin.Security.Providers.LinkedIn;
using System;
using System.Configuration;
using System.Threading.Tasks;

[assembly: OwinStartup(typeof(Maginco.App_Start.Startup))]

namespace Maginco.App_Start
{
    public class Startup
    {
        const string XmlSchemaString = "http://www.w3.org/2001/XMLSchema#string";
        internal static IDataProtectionProvider DataProtectionProvider { get; private set; }

        public void Configuration(IAppBuilder app)
        {

            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);
            app.CreatePerOwinContext<ApplicationSignInManager>(ApplicationSignInManager.Create);
            app.UseCookieAuthentication(new CookieAuthenticationOptions
            {
                AuthenticationType = "ApplicationCookie",
                LoginPath = new PathString("/auth/login")
            });

            DataProtectionProvider = app.GetDataProtectionProvider();


            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Enables the application to temporarily store user information when they are verifying the second factor in the two-factor authentication process.
            app.UseTwoFactorSignInCookie(DefaultAuthenticationTypes.TwoFactorCookie, TimeSpan.FromMinutes(5));

            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings.Get("FacebookAppId")))
            {
                var facebookOptions = new Microsoft.Owin.Security.Facebook.FacebookAuthenticationOptions
                {
                    AppId = ConfigurationManager.AppSettings.Get("FacebookAppId"),
                    AppSecret = ConfigurationManager.AppSettings.Get("FacebookAppSecret"),

                    Provider = new Microsoft.Owin.Security.Facebook.FacebookAuthenticationProvider
                    {
                        OnAuthenticated = (context) =>
                        {
                            context.Identity.AddClaim(new System.Security.Claims.Claim("urn:facebook:access_token", context.AccessToken, XmlSchemaString, "Facebook"));
                            //context.Identity.AddClaim(new System.Security.Claims.Claim("urn:facebook:email", context.Email, XmlSchemaString, "Facebook"));
                            foreach (var x in context.User)
                            {
                                var claimType = string.Format("urn:facebook:{0}", x.Key);
                                string claimValue = x.Value.ToString();
                                if (!context.Identity.HasClaim(claimType, claimValue))
                                    context.Identity.AddClaim(new System.Security.Claims.Claim(claimType, claimValue, XmlSchemaString, "Facebook"));

                            }
                            return Task.FromResult(0);
                        }
                    }
                };

                facebookOptions.Scope.Add("email");
                app.UseFacebookAuthentication(facebookOptions);
            }



            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings.Get("TwitterAppId")))
            {
                var twitterOptions = new Microsoft.Owin.Security.Twitter.TwitterAuthenticationOptions
                {
                    ConsumerKey = ConfigurationManager.AppSettings.Get("TwitterAppId"),
                    ConsumerSecret = ConfigurationManager.AppSettings.Get("TwitterAppSecret"),
                    BackchannelCertificateValidator = new CertificateSubjectKeyIdentifierValidator(new[]
                        {
                            "A5EF0B11CEC04103A34A659048B21CE0572D7D47", 
                            "0D445C165344C1827E1D20AB25F40163D8BE79A5", 
                            "7FD365A7C2DDECBBF03009F34339FA02AF333133", 
                            "39A55D933676616E73A761DFA16A7E59CDE66FAD", 
                            "5168FF90AF0207753CCCD9656462A212B859723B",
                            "B13EC36903F8BF4701D498261A0802EF63642BC3" 
                        }),
                    Provider = new Microsoft.Owin.Security.Twitter.TwitterAuthenticationProvider
                    {
                        OnAuthenticated = (context) =>
                        {
                            context.Identity.AddClaim(new System.Security.Claims.Claim("urn:twitter:access_token", context.AccessToken, XmlSchemaString, "Twitter"));
                            return Task.FromResult(0);
                        }
                    }
                };

                app.UseTwitterAuthentication(twitterOptions);
            }

            if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings.Get("GoogleAppId")))
            {
                var GoogleOptions = new Microsoft.Owin.Security.Google.GoogleOAuth2AuthenticationOptions
                {
                    ClientId = ConfigurationManager.AppSettings.Get("GoogleAppId"),
                    ClientSecret = ConfigurationManager.AppSettings.Get("GoogleAppSecret"),
                    //SignInAsAuthenticationType = DefaultAuthenticationTypes.ExternalCookie,
                    Provider = new Microsoft.Owin.Security.Google.GoogleOAuth2AuthenticationProvider
                    {
                        OnAuthenticated = (context) =>
                        {
                            context.Identity.AddClaim(new System.Security.Claims.Claim("urn:google:access_token", context.AccessToken, XmlSchemaString, "Google"));
                            context.Identity.AddClaim(new System.Security.Claims.Claim("First_Name", context.GivenName, XmlSchemaString, "Google"));
                            context.Identity.AddClaim(new System.Security.Claims.Claim("Last_Name", context.FamilyName, XmlSchemaString, "Google"));
                            context.Identity.AddClaim(new System.Security.Claims.Claim("Email", context.Email, XmlSchemaString, "Google"));
                            return Task.FromResult(0);
                        }
                    }
                };
                
               
                app.UseGoogleAuthentication(GoogleOptions);
            }

             if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings.Get("LinkedInAppId")))
            {
                var LinkedInOptions = new Owin.Security.Providers.LinkedIn.LinkedInAuthenticationOptions
                {
                    ClientId = ConfigurationManager.AppSettings.Get("LinkedInAppId"),
                    ClientSecret = ConfigurationManager.AppSettings.Get("LinkedInAppSecret"),
                    
                    Provider = new Owin.Security.Providers.LinkedIn.LinkedInAuthenticationProvider
                    {
                        OnAuthenticated = (context) =>
                        {
                            context.Identity.AddClaim(new System.Security.Claims.Claim("urn:google:access_token", context.AccessToken, XmlSchemaString, "LinkedIn"));
                            context.Identity.AddClaim(new System.Security.Claims.Claim("First_Name", context.GivenName, XmlSchemaString, "LinkedIn"));
                            context.Identity.AddClaim(new System.Security.Claims.Claim("Last_Name", context.FamilyName, XmlSchemaString, "LinkedIn"));
                            context.Identity.AddClaim(new System.Security.Claims.Claim("Email", context.Email, XmlSchemaString, "LinkedIn"));
                            context.Identity.AddClaim(new System.Security.Claims.Claim("Company", context.Positions, XmlSchemaString, "LinkedIn"));
                            return Task.FromResult(0);
                        }
                    }
                };
                

                app.UseLinkedInAuthentication(LinkedInOptions);
            }
           
        }

    }
    }

