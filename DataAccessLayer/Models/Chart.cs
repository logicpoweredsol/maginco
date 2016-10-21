using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.Models
{
    public class Chart
    {
        [Key]
        public int iID { get; set; }
        public string strName { get; set; }
        public string strDate { get; set; }
        public string strSvgContent { get; set; }
        
        public string strUserId { get; set; }
        public virtual AppUserModel User { get; set; }
    }
}
