using DataAccessLayer.Entities;
using DataAccessLayer.Models;
using Maginco.App_Start;
using Maginco.AppCode.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security.DataProtection;
using System;

namespace Maginco.AppCode.Auth
{
    public class AuthManager
    {
        public static UserStore<AppUserModel> GetDbStore()
        {
            return new UserStore<AppUserModel>(new AuthDbContext());
        }

        public static UserManager<AppUserModel> GetUserManager()
        {
            var usermanager = new UserManager<AppUserModel>(new UserStore<AppUserModel>(new AuthDbContext()));

            var provider = new DpapiDataProtectionProvider("Maginco");

            usermanager.UserTokenProvider = new Microsoft.AspNet.Identity.Owin.DataProtectorTokenProvider<AppUserModel>(Startup.DataProtectionProvider.Create("EmailConfirmation"))
            {
                TokenLifespan = TimeSpan.FromHours(3)
            };

            usermanager.UserValidator = new UserValidator<AppUserModel>(usermanager)
            {
                AllowOnlyAlphanumericUserNames = false
            };

            usermanager.EmailService = new EmailService();
            
            return usermanager;
        }

        public static RoleManager<IdentityRole> GetRoleManager()
        {
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(new AuthDbContext()));

            if (!roleManager.RoleExists(AppConsts.AppRoles.ADMIN.ToString()))
            {
                IdentityRole role = new IdentityRole();

                role.Name = AppConsts.AppRoles.ADMIN.ToString();
                roleManager.Create(role);
            }

            if (!roleManager.RoleExists(AppConsts.AppRoles.FREEMIUM.ToString()))
            {
                IdentityRole role = new IdentityRole();

                role.Name = AppConsts.AppRoles.FREEMIUM.ToString();
                roleManager.Create(role);
            }

            if (!roleManager.RoleExists(AppConsts.AppRoles.PREMIUM.ToString()))
            {
                IdentityRole role = new IdentityRole();

                role.Name = AppConsts.AppRoles.PREMIUM.ToString();
                roleManager.Create(role);
            }

            AddAdminUser();

            return roleManager;
        }

        private static void AddAdminUser()
        {
            var usermanager = AuthManager.GetUserManager();

            if (usermanager.FindByEmail("admin@maginco.com") == null)
            {
                usermanager.Create<AppUserModel, string>(new AppUserModel
                {
                    addressLine1 = "admin address 1",
                    emailAddress = "admin@maginco.com",
                    Email = "admin@maginco.com",
                    EmailConfirmed = true,
                    firstName = "Admin",
                    middleName = "Master",
                    lastName = "Last",
                    password = "Admin123",
                }, "Admin123");

                var admin = usermanager.FindByEmail("admin@maginco.com");

                usermanager.AddToRole<AppUserModel, string>(admin.Id, AppConsts.AppRoles.ADMIN.ToString());
            }
        }
    }
}