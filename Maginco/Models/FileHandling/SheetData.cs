using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Maginco.Models.FileHandling
{
    public class ExcelSheet
    {
        public string name;
        public string data;

        public ExcelSheet(string name, string data)
        {
            this.name = name;
            this.data = data;
        }
    }
}