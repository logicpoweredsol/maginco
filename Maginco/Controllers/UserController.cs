using DataAccessLayer.Entities;
using DataAccessLayer.Models;
using DataAccessLayer.Repositories;
using Maginco.App_Start;
using Maginco.AppCode;
using Maginco.AppCode.Auth;
using Maginco.AppCode.FileHandling;
using Maginco.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace Maginco.Controllers
{
    public class UserController : Controller
    {
        DashboardModel model;
        FileParsingHelper fileParsingHelper;
        GenericRepository<Chart> chartsRepo;
        GenericRepository<AppUserModel> usersRepo;
        GenericRepository<IdentityRole> rolesRepo;

        public ActionResult Dashboard()
        {
            model = ClaimsManager.GetClaims(User.Identity);

            return View(model);
        }

        [Authorize(Roles = "PREMIUM")]
        public ActionResult CreateChart()
        {
            return View();
        }

        [HttpPost, Authorize(Roles = "PREMIUM"), ValidateInput(false)]
        public ActionResult CreateChart(int? dummyParam)
        {
            var form = Request.Unvalidated.Form;
            var svgData = form.Get("svgData");

            ViewBag.SvgData = svgData;

            return View();
        }

        public async Task<ActionResult> EditProfile()
        {
            string id = ClaimsManager.GetClaims(User.Identity).id;
            var manager = AuthManager.GetUserManager();

            AppUserModel appUser = await manager.FindByIdAsync(id);

            RegisterModel registerModel = AutoMapperConfig.mapperConfig.Map<RegisterModel>(appUser);

            return View(registerModel);
        }

        [HttpPost]
        public async Task<ActionResult> EditProfile(RegisterModel model, HttpPostedFileBase avatarFile)
        {
            string newHash;
            string id = ClaimsManager.GetClaims(User.Identity).id;

            var manager = AuthManager.GetUserManager();
            
            AppUserModel updatedUser = await manager.FindByIdAsync(id);

            //you can't use AutoMapper here because it will set non model properties of Identity User to null
            updatedUser.addressLine1 = model.addressLine1;
            updatedUser.addressLine2 = model.addressLine2;
            updatedUser.addressLine3 = model.addressLine3;
            updatedUser.companyName = model.companyName;
            updatedUser.companyWebsite = model.companyWebsite;
            updatedUser.contactNumber = model.contactNumber;
            updatedUser.country = Request["ddlCountry"].ToString();
            updatedUser.firstName = model.firstName;
            updatedUser.lastName = model.lastName;
            updatedUser.middleName = model.middleName;
            updatedUser.password = model.password;
            updatedUser.postCode = model.postCode;

            newHash = manager.PasswordHasher.HashPassword(updatedUser.password);

            updatedUser.PasswordHash = newHash;

            var updation = await manager.UpdateAsync(updatedUser);

            if (updation.Succeeded)
            {
               
                if (avatarFile != null)
                {
                    string[] files = Directory.GetFiles(Server.MapPath("/Resc/images/users/"), id + ".*");
                    foreach(string file in files)
                    {

                        System.IO.File.Delete(file);
                    }
                    string ext = Path.GetExtension(avatarFile.FileName);
                    string fileUrl = String.Concat(Server.MapPath("/Resc/images/users/"), id, ext);
                    avatarFile.SaveAs(fileUrl);
                }
              
                return RedirectToAction("Dashboard");
            }

            TempData["hasUpdationError"] = "true";

            return View();
        }

        [HttpGet]
        public ActionResult UpdateEmail()
        {
            model = ClaimsManager.GetClaims(User.Identity);

            return View(model);
        }

        [HttpPost]
        public async Task<ActionResult> UpdateEmail(FormCollection form)
        {
            model = ClaimsManager.GetClaims(User.Identity);

            string newEmail = form.Get("txtEmail");
            string password = form.Get("txtPassword");

            string id = ClaimsManager.GetClaims(User.Identity).id;

            var manager = AuthManager.GetUserManager();

            AppUserModel appUser = await manager.FindByIdAsync(id);

            appUser.emailAddress = appUser.Email = newEmail;
            appUser.EmailConfirmed = false;

            if (password.Equals(appUser.password))
            {
                var updateProcess = await manager.UpdateAsync(appUser);

                if (updateProcess.Succeeded)
                {
                    string code = await manager.GenerateEmailConfirmationTokenAsync(appUser.Id);

                    var callbackUrl = Url.Action("EmailConfirm", "Auth", new { userId = appUser.Id, code = code }, protocol: Request.Url.Scheme);

                    await manager.SendEmailAsync(appUser.Id, "Vizfully-Account Confirmation", AppConsts.EmailTexts.GetEmailUpdateText(appUser.firstName, callbackUrl));

                    ViewBag.UpdateSuccess = "An email with activation link has been sent to the new email address.";

                    return View(model);
                }

                ViewBag.UpdateError = "Unable to update email. Something went wrong.";

                return View(model);
            }

            ViewBag.UpdateError = "Invalid password.";

            return View(model);
        }


        //********* PayPal Intergration *********//

        [HttpPost]
        public ActionResult CreatePayment(DashboardModel model)
        {
            string baseUrl = Request.Url.Scheme + "://" + Request.Url.Authority +
            Request.ApplicationPath.TrimEnd('/') + "/";
            var payment = AppCode.PayPal.PayPalPayment.CreatePayment(baseUrl, "sale");
            TempData["User"] = model;
            return Redirect(payment.GetApprovalUrl());
        }

        public ActionResult PaymentCancelled()
        {
            // TODO: Handle cancelled payment
            return RedirectToAction("Dashboard");
        }

        public ActionResult PaymentSuccessful(string paymentId, string token, string PayerID)
        {
            // Execute Payment
            TempData["UserModel"] = TempData["User"];
            
            var payment = AppCode.PayPal.PayPalPayment.ExecutePayment(paymentId, PayerID);
            return RedirectToAction("UpgradeAccount");
        }

        //********* PayPal Intergration End *********//

        [AllowAnonymous]
        public async Task<ActionResult> UpgradeAccount()
        {
            var model = TempData["UserModel"] as DashboardModel;

            UserManager<AppUserModel> userManager = AuthManager.GetUserManager();

            var removal = await userManager.RemoveFromRolesAsync(model.id, AppConsts.AppRoles.FREEMIUM.ToString());

            if (removal.Succeeded)
            {
                var upgradtion = await userManager.AddToRolesAsync(model.id, AppConsts.AppRoles.PREMIUM.ToString());

                if(upgradtion.Succeeded)
                {
                    await userManager.SendEmailAsync(model.id, "Account Upgraded", AppConsts.EmailTexts.GetAccountUpgradeText(model.firstName, model.accountExpireDate));
                }
            }

            return RedirectToAction("Dashboard");
        }

        [Authorize(Roles = "ADMIN")]
        public ActionResult AdminPanel()
        {
            return View();
        }

        [Authorize(Roles = "ADMIN")]
        public ActionResult EditUsers()
        {
            return View();
        }

        [Authorize(Roles = "ADMIN")]
        public ActionResult EditCharts()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> UpgradeFromAdmin(string userId)
        {
            UserManager<AppUserModel> userManager = AuthManager.GetUserManager();

            var removal = await userManager.RemoveFromRolesAsync(userId, AppConsts.AppRoles.FREEMIUM.ToString());

            if (removal.Succeeded)
            {
                var upgradtion = await userManager.AddToRolesAsync(userId, AppConsts.AppRoles.PREMIUM.ToString());

                if (upgradtion.Succeeded)
                {
                    return Json(true);
                }
            }

            return Json(false);
        }

        [HttpPost]
        public async Task<JsonResult> DowngradeFromAdmin(string userId)
        {
            UserManager<AppUserModel> userManager = AuthManager.GetUserManager();

            var removal = await userManager.RemoveFromRolesAsync(userId, AppConsts.AppRoles.PREMIUM.ToString());

            if (removal.Succeeded)
            {
                var downgradtion = await userManager.AddToRolesAsync(userId, AppConsts.AppRoles.FREEMIUM.ToString());

                if (downgradtion.Succeeded)
                {
                    return Json(true);
                }
            }

            return Json(false);
        }

        [HttpPost, ValidateInput(false)]
        public JsonResult SaveChart(Chart chart)
        {
            try
            {
                var id = User.Identity.GetUserId();
                var authDB = new AuthDbContext();
                var user = authDB.Users.Where(u => u.Id == id).FirstOrDefault();

                chart.strUserId = id;
                chart.strDate = DateTime.Now.ToShortDateString();

                chartsRepo = new GenericRepository<Chart>();

                var result = chartsRepo.Add(chart);

                return Json(result.iID > 0);
            }
            catch (Exception ex)
            {
                return Json(ex.ToString());
            }
        }

        [HttpGet]
        public JsonResult GetAllCharts()
        {
            chartsRepo = new GenericRepository<Chart>();

            var result = chartsRepo.GetAll().ToList();

            var filtered = result.Select(c => new
            {
                iID = c.iID,
                strName = c.strName,
                strDate = c.strDate,
                strUsername = GetUsername(c.strUserId)
            });

            var dtFormat = new
            {
                data = filtered
            };

            return Json(dtFormat, "application/json", JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetCharts()
        {
            chartsRepo = new GenericRepository<Chart>();

            var id = User.Identity.GetUserId();
            var result = chartsRepo.GetAll().Where(c => c.strUserId == id);

            var filtered = result.Select(c => new {
                iID = c.iID,
                strName = c.strName,
                strDate = c.strDate,
                strSvg = c.strSvgContent,
            });

            var dtFormat = new
            {
                data = filtered,
            };

            return Json(dtFormat, "application/json", JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetUsers()
        {
            usersRepo = new GenericRepository<AppUserModel>();
            
            var appUsers = usersRepo.GetAll();
            var selectedUsers = appUsers.Select(u => new {
                u.Id,
                u.firstName,
                u.emailAddress,
                u.contactNumber,
                u.EmailConfirmed,
                type = GetRoleName(u.Roles.FirstOrDefault().RoleId)
            });
            var dtFormat = new
            {
                data = selectedUsers
            };

            return Json(dtFormat, "application/json", JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GetSampleData(string fileName)
        {
            fileParsingHelper = new FileParsingHelper(String.Concat(Server.MapPath("~/Resc/SampleData/"), fileName));

            return Json(fileParsingHelper.ReadData(), JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult UploadFile()
        {
            HttpPostedFileBase file = Request.Files[0];

            fileParsingHelper = new FileParsingHelper(String.Concat(Server.MapPath("~/Resc/TempUploads/"), file.FileName));
            fileParsingHelper.UploadInputFile(file);

            return Json(fileParsingHelper.GetExcelData());
        }

        #region Helpers

        private string GetRoleName(string roleID)
        {
            rolesRepo = new GenericRepository<IdentityRole>();

            var fullRole = rolesRepo.GetAll().Where(r => r.Id == roleID).FirstOrDefault();

            return fullRole == null ? String.Empty : fullRole.Name; 
        }

        private string GetUsername(string id)
        {
            usersRepo = new GenericRepository<AppUserModel>();

            var user = usersRepo.GetAll().Where(u => u.Id == id).FirstOrDefault();

            return user != null ? user.firstName : String.Empty;
        }

        #endregion
    }
}