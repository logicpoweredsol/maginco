using AutoMapper;
using DataAccessLayer.Models;
using Maginco.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Maginco.App_Start
{
    public class AutoMapperConfig
    {
        public static IMapper mapperConfig { get; set; }

        public static void Configure()
        {
            var config = new MapperConfiguration(cfg => {
                cfg.CreateMap<RegisterModel, AppUserModel>();
                cfg.CreateMap<AppUserModel, RegisterModel>();
            });

            mapperConfig = config.CreateMapper();
        }
    }
}