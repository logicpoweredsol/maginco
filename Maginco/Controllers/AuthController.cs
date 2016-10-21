using DataAccessLayer.Models;
using Maginco.App_Start;
using Maginco.AppCode;
using Maginco.AppCode.Auth;
using Maginco.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Maginco.Controllers
{
    [AllowAnonymous]
    public class AuthController : Controller
    {
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

        public ActionResult Logout()
        {
            var ctx = Request.GetOwinContext();
            var authManager = ctx.Authentication;

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

                await userManager.SendEmailAsync(appUser.Id, "Maginco-Account Confirmation", AppConsts.EmailTexts.GetNewAccountText(appUser.emailAddress, callbackUrl));

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

            if(roles == null || roles.Count < 1)
            {
                await userManager.AddToRolesAsync(userId, AppConsts.AppRoles.FREEMIUM.ToString());
                await userManager.SendEmailAsync(userId, "Welcome to Maginco", AppConsts.EmailTexts.GetAccountWelcomeText(user.emailAddress));
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
}

        #endregion