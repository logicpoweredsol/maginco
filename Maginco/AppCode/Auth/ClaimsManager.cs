using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Claims;
using System.Security.Principal;
using Maginco.Models;

namespace Maginco.AppCode.Auth
{
    public class ClaimsManager
    {
        public static DashboardModel GetClaims(IIdentity identity)
        {
            var claimsIdentity = (ClaimsIdentity)identity;

            IEnumerable<Claim> claims = claimsIdentity.Claims;

            return new DashboardModel
            {
                id = claims.First(c => c.Type == ClaimTypes.Sid).Value,
                firstName = claims.First(c => c.Type == ClaimTypes.GivenName).Value,
                role = claims.First(c => c.Type == ClaimTypes.Role).Value,
                accountExpireDate = claims.First(c => c.Type == ClaimTypes.Expiration).Value,
                companyName = claims.First(c => c.Type == AppConsts.AppClaims.ComapnyName.ToString()).Value,
            };
        }
    }
}