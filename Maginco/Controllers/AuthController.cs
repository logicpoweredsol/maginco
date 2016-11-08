using DataAccessLayer.Models;
using Facebook;
using LinqToTwitter;
using Maginco.App_Start;
using Maginco.AppCode;
using Maginco.AppCode.Auth;
using Maginco.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System.Linq;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Helpers;
using Newtonsoft.Json.Linq;

namespace Maginco.Controllers
{
    [AllowAnonymous]
 public class AuthController : Controller
    {
        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }
        private readonly UserManager<AppUserModel> userManager;
        private readonly RoleManager<IdentityRole> roleManager;

        public AuthController()
        {
            userManager = AuthManager.GetUserManager();
            roleManager = AuthManager.GetRoleManager();
        }

        public ActionResult Login(string returnUrl)
        {
            LoginModel loginModel = new LoginModel
            {
                returnUrl = returnUrl
            };

            return View(loginModel);
        }

        [HttpPost]
        public async Task<ActionResult> Login(LoginModel loginModel)
        {
            var appUser = await userManager.FindAsync(loginModel.email, loginModel.password);

            if (appUser != null && appUser.EmailConfirmed)
            {
                await SignIn(appUser, loginModel.rememberMe);

                return Redirect(GetRedirectUrl(loginModel.returnUrl, appUser.Id));
            }

            TempData["hasLoginError"] = "true";

            return View();
        }


        //********* External Login Providers Code Region******//

        public ActionResult Facebook(string returnUrl)
        { 
            // Request a redirect to the external login provider
            return new ChallengeResult("Facebook", Url.Action("ExternalFbLoginCallback", "Auth", new { ReturnUrl = returnUrl }));
        }

        [AllowAnonymous]
        public async Task<ActionResult> ExternalFbLoginCallback(string returnUrl)
        {
             
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            ClaimsIdentity ext = await AuthenticationManager.GetExternalIdentityAsync(DefaultAuthenticationTypes.ExternalCookie);
            var AccessToken = "";
            foreach (Claim clm in ext.Claims)
            {
                if (clm.Type == "urn:facebook:access_token")
                   AccessToken = clm.Value; 

            }
                var client = new FacebookClient();
                client.AccessToken = AccessToken;
                dynamic me = client.Get("/me?fields=email,first_name, last_name,verified");
            
             
            if (me.email == null)
                return RedirectToAction("Login");

            var appUser = await userManager.FindByEmailAsync(me.email);
            if (appUser == null)
            {
                AppUserModel appuser = new AppUserModel();
                appuser.emailAddress = me.email;
                appuser.firstName = me.first_name;
                appuser.lastName = me.last_name;
                appuser.UserName = me.email;
                appuser.Email = me.email;
                appuser.EmailConfirmed = me.verified;
                appuser.accountExpireDate = DateTime.Now.AddMonths(3).ToShortDateString();
                appuser.companyName = "Unknown";
                var result = await userManager.CreateAsync(appuser);
                appuser = await userManager.FindByEmailAsync(appuser.emailAddress);
                await userManager.AddToRolesAsync(appuser.Id, AppConsts.AppRoles.FREEMIUM.ToString());
                await SignIn(appuser, false);
            }
            else
            {
                await SignIn(appUser, false);
            }

            return RedirectToAction("dashboard", "user");

        }

        public ActionResult Twitter(string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult("Twitter", Url.Action("ExternalTWLoginCallback", "Auth", new { ReturnUrl = returnUrl }));
        }

        [AllowAnonymous]
        public async Task<ActionResult> ExternalTWLoginCallback(string returnUrl)
        {
            
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();
            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }
            
            ClaimsIdentity ext = await AuthenticationManager.GetExternalIdentityAsync(DefaultAuthenticationTypes.ExternalCookie);
            var AccessToken = "";

           
            foreach (Claim clm in ext.Claims)
            {
                if (clm.Type == "urn:twitter:access_token")
                   AccessToken = clm.Value;
            }

                var authTwitter = new SingleUserAuthorizer
                {
                    CredentialStore = new SingleUserInMemoryCredentialStore
                    {
                        ConsumerKey = "CluAp7CCaoCjUMPGqa0TVTUYP",
                        ConsumerSecret = "ZhnOhatYS9Z0EyMbCARzWnzfAsghMJSBe47QORldg7ZRdGjS1Y",
                        OAuthToken = "2685481184-pvADYhwEjtiHb4jBLuIW4V0N3XMs7k5mq6TEXX4",
                        OAuthTokenSecret = "lujvWMbFC2Nt9CGO4zvAg6U6IVPY1If0bGv60VcB4E9zA",
                        UserID = ulong.Parse(loginInfo.Login.ProviderKey),
                        ScreenName = loginInfo.DefaultUserName
                    }
                };

                await authTwitter.AuthorizeAsync();

                var twitterCtx = new TwitterContext(authTwitter);
                var verifyResponse =
                      await
                          (from acct in twitterCtx.Account
                           where (acct.Type == AccountType.VerifyCredentials) && (acct.IncludeEmail == true)
                           select acct).SingleOrDefaultAsync();
                dynamic me = verifyResponse.User;
            
           
            if (me.Email == null)
                return RedirectToAction("Login");

            var appUser = await userManager.FindByEmailAsync(me.Email);
            if (appUser == null)
            {
                AppUserModel appuser = new AppUserModel();
                appuser.emailAddress = me.Email;
                appuser.firstName = me.ScreenNameResponse;
                appuser.UserName = me.Email;
                appuser.Email = me.Email;
                appuser.EmailConfirmed = true;
                appuser.accountExpireDate = DateTime.Now.AddMonths(3).ToShortDateString();
                appuser.companyName = "Unknown";
                var result = await userManager.CreateAsync(appuser);
                appuser = await userManager.FindByEmailAsync(appuser.emailAddress);
                await userManager.AddToRolesAsync(appuser.Id, AppConsts.AppRoles.FREEMIUM.ToString());
                await SignIn(appuser, false);
            }
            else
            {
                await SignIn(appUser, false);
            }

            return RedirectToAction("dashboard", "user");
            
        }

        public ActionResult Google(string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult("Google", Url.Action("ExternalGoogleLoginCallback", "Auth", new { ReturnUrl = returnUrl }));
        }

        [AllowAnonymous] 
        public async Task<ActionResult> ExternalGoogleLoginCallback(string returnUrl)
        {

            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();

            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            ClaimsIdentity ext = await AuthenticationManager.GetExternalIdentityAsync(DefaultAuthenticationTypes.ExternalCookie);
            var fname = "";
            var lname = "";
            var email = "";
            foreach (Claim clm in ext.Claims)
            {
                if (clm.Type == "First_Name")
                    fname = clm.Value;
                if (clm.Type == "Last_Name")
                    lname = clm.Value;
                if (clm.Type == "Email")
                    email = clm.Value;
            }

            if (email == null)
                return RedirectToAction("Login");

            var appUser = await userManager.FindByEmailAsync(email);
            if (appUser == null)
            {
                AppUserModel appuser = new AppUserModel();
                appuser.emailAddress = email;
                appuser.firstName = fname;
                appuser.lastName = lname;
                appuser.UserName = email;
                appuser.Email = email;
                appuser.EmailConfirmed = true;
                appuser.accountExpireDate = DateTime.Now.AddMonths(3).ToShortDateString();
                appuser.companyName = "Unknown";
                var result = await userManager.CreateAsync(appuser);
                appuser = await userManager.FindByEmailAsync(appuser.emailAddress);
                await userManager.AddToRolesAsync(appuser.Id, AppConsts.AppRoles.FREEMIUM.ToString());
                await SignIn(appuser, false);
            }
            else
            {
                await SignIn(appUser, false);
            }

            return RedirectToAction("dashboard", "user");

        }

        public ActionResult LinkedIn(string returnUrl)
        {
            // Request a redirect to the external login provider
            return new ChallengeResult("LinkedIn", Url.Action("ExternalLinkedInLoginCallback", "Auth", new { ReturnUrl = returnUrl }));
        }

        [AllowAnonymous]
        public async Task<ActionResult> ExternalLinkedInLoginCallback(string returnUrl)
        {
             
            var loginInfo = await AuthenticationManager.GetExternalLoginInfoAsync();

            if (loginInfo == null)
            {
                return RedirectToAction("Login");
            }

            ClaimsIdentity ext = await AuthenticationManager.GetExternalIdentityAsync(DefaultAuthenticationTypes.ExternalCookie);
            var fname = "";
            var lname = "";
            var email = "";
            var company = "";
            foreach (Claim clm in ext.Claims)
            {
                if (clm.Type == "First_Name")
                    fname = clm.Value;
                if (clm.Type == "Last_Name")
                    lname = clm.Value;
                if (clm.Type == "Email")
                    email = clm.Value;
                if (clm.Type == "Company")
                    company = clm.Value;   
            }
            if(company != null)
            {
                dynamic data = JObject.Parse(company);
                company = data.values[0].company.name;
            }
            if (email == null)
                return RedirectToAction("Login");

            var appUser = await userManager.FindByEmailAsync(email);
            if (appUser == null)
            {
                AppUserModel appuser = new AppUserModel();
                appuser.emailAddress = email;
                appuser.firstName = fname;
                appuser.lastName = lname;
                appuser.UserName = email;
                appuser.Email = email;
                appuser.EmailConfirmed = true;
                appuser.accountExpireDate = DateTime.Now.AddMonths(3).ToShortDateString();
                appuser.companyName = company;
                if (company == null)
                    appuser.companyName = "Unknown";
                var result = await userManager.CreateAsync(appuser);
                appuser = await userManager.FindByEmailAsync(appuser.emailAddress);
                await userManager.AddToRolesAsync(appuser.Id, AppConsts.AppRoles.FREEMIUM.ToString());
                await SignIn(appuser, false);
            }
            else
            {
                await SignIn(appUser, false);
            }

            return RedirectToAction("dashboard", "user");

        }


        //*****************External Login Providers Code Ends Here******//     

        public ActionResult Logout()
        {
            var ctx = Request.GetOwinContext();
            var authManager = ctx.Authentication;
            authManager.SignOut(DefaultAuthenticationTypes.ExternalCookie);
            authManager.SignOut("ApplicationCookie");
            return RedirectToAction("index", "home");
        }

        public ActionResult Register()
        {
            return View();
        }

        [HttpPost]
        public async Task<ActionResult> Register(RegisterModel model)
        {
            AppUserModel appUser = AutoMapperConfig.mapperConfig.Map<AppUserModel>(model);

            appUser.Email = model.emailAddress;

            var result = await userManager.CreateAsync(appUser, model.password);

            if (result.Succeeded)
            {
                string code = await userManager.GenerateEmailConfirmationTokenAsync(appUser.Id);

                var callbackUrl = Url.Action("EmailConfirm", "Auth", new { userId = appUser.Id, code = code }, protocol: Request.Url.Scheme);

                await userManager.SendEmailAsync(appUser.Id, "Vizfully-Account Confirmation", AppConsts.EmailTexts.GetNewAccountText(appUser.emailAddress, callbackUrl));

                return RedirectToAction("EmailSent", "Auth");
            }

            TempData["hasRegisterError"] = "true";

            return View();
        }

        public ActionResult EmailSent()
        {
            return View();
        }

        public async Task<ActionResult> EmailConfirm(string userId, string code)
        {
            var result = await userManager.ConfirmEmailAsync(userId, code);
            var user = await userManager.FindByIdAsync(userId);
            var roles = userManager.GetRoles(userId);

            if (roles == null || roles.Count < 1)
            {
                await userManager.AddToRolesAsync(userId, AppConsts.AppRoles.FREEMIUM.ToString());
                await userManager.SendEmailAsync(userId, "Welcome to Vizfully", AppConsts.EmailTexts.GetAccountWelcomeText(user.emailAddress));
            }

            return View();
        }

        #region HelperMehtods

        private string GetRedirectUrl(string returnUrl, string id)
        {
            if(IsAdminUser(id))
            {
                return Url.Action("adminpanel", "user");
            }

            if (string.IsNullOrEmpty(returnUrl) || !Url.IsLocalUrl(returnUrl))
            {
                return Url.Action("dashboard", "user");
            }

            return returnUrl;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && userManager != null)
            {
                userManager.Dispose();
            }

            base.Dispose(disposing);
        }

        private async Task SignIn(AppUserModel appUser, bool isPersistent)
        {
            ClaimsIdentity identity = await userManager.CreateIdentityAsync(appUser, DefaultAuthenticationTypes.ApplicationCookie);

            string role = userManager.GetRoles(appUser.Id)[0].ToString();
            identity.AddClaim(new Claim(ClaimTypes.GivenName, appUser.firstName));
            identity.AddClaim(new Claim(ClaimTypes.Expiration, appUser.accountExpireDate));
            identity.AddClaim(new Claim(ClaimTypes.Sid, appUser.Id));
            identity.AddClaim(new Claim(ClaimTypes.Role, role));
            identity.AddClaim(new Claim(AppConsts.AppClaims.ComapnyName.ToString(), appUser.companyName));

            var ctx = Request.GetOwinContext();
            var authManager = ctx.Authentication;

            authManager.SignIn(new Microsoft.Owin.Security.AuthenticationProperties { IsPersistent = isPersistent }, identity);
        }

        public bool IsAdminUser(string id)
        {
            //if (User.Identity.IsAuthenticated)
            {
                var usermanager = AuthManager.GetUserManager();
                var roles = usermanager.GetRoles(id);

                if (roles[0].ToString() == AppConsts.AppRoles.ADMIN.ToString())
                {
                    return true;
                }
            }

            return false;
        }
    }


    //***********************************8//

    
    internal class ChallengeResult : HttpUnauthorizedResult
    {
        public ChallengeResult(string provider, string redirectUri)
            : this(provider, redirectUri, null)
        {
        }

        public ChallengeResult(string provider, string redirectUri, string userId)
        {
            LoginProvider = provider;
            RedirectUri = redirectUri;
            UserId = userId;
        }

        public string LoginProvider { get; set; }
        public string RedirectUri { get; set; }
        public string UserId { get; set; }
        private const string XsrfKey = "XsrfId";
        public override void ExecuteResult(ControllerContext context)
        {
            var properties = new AuthenticationProperties { RedirectUri = RedirectUri };
            if (UserId != null)
            {
                properties.Dictionary[XsrfKey] = UserId;
            }
            context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
        }
    }
}

        #endregion