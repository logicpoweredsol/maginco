using Excel;
using Maginco.Models.FileHandling;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Web;


namespace Maginco.AppCode.FileHandling
{
    public class FileParsingHelper
    {
        public string path { get; set; }

        public FileParsingHelper(string path)
        {
            this.path = path;
        }

        public void UploadInputFile(HttpPostedFileBase file)
        {
            DeleteInputFile();

            file.SaveAs(path);
        }

        public void DeleteInputFile()
        {
            if (File.Exists(path))
            {
                File.Delete(path);
            }
        }

        public string ReadData()
        {
            return File.ReadAllText(path);
        }

        public List<ExcelSheet> GetExcelData()
        {
            List<ExcelSheet> lstSheetsData;
            IExcelDataReader excelReader;
            DataTableCollection tables;
            DataSet result;

            string csvData;
            List<string> cellValue;
            int i;

            FileStream stream = File.Open(path, FileMode.Open, FileAccess.Read);

            using (excelReader = ExcelReaderFactory.CreateOpenXmlReader(stream) )
            {
                result = excelReader.AsDataSet();

                lstSheetsData = new List<ExcelSheet>();

                tables = result.Tables;

                foreach (DataTable item in tables)
                {
                    csvData = "";

                    i = 0;

                    while (i < item.Rows.Count)
                    {
                        cellValue = new List<string>();

                        for (int j = 0; j < item.Columns.Count; j++)
                        {
                            cellValue.Add(item.Rows[i][j].ToString().Trim());
                        }

                        csvData += String.Join(",", cellValue);

                        i++;

                        csvData += Environment.NewLine;
                    }
                    
                    lstSheetsData.Add(new ExcelSheet(item.TableName, csvData));
                }
            }
            
            return lstSheetsData;
        }
    }
}