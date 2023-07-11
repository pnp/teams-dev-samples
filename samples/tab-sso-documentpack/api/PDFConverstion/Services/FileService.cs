using PDFConversion.Models;
using PDFConverstion.Helpers;
using PdfSharp.Pdf;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PDFConverstion.Services
{
    public class FileService
    {
        public FileService() { }

        public byte[] Merge(List<RequestDetail> docSet)
        {
            byte[] fileContents = null;
            PdfDocument masterPdf = new PdfDocument();
            try
            {

                using (MemoryStream stream = new MemoryStream())
                {
                    // Loop all files
                    foreach (RequestDetail file in docSet)
                    {                        
                        FilesHelper.MergeFile(masterPdf, file);                        
                    }

                    masterPdf.Save(stream, false);
                    fileContents = stream.ToArray();
                }
            }
            catch (Exception ex)
            {                
                throw new Exception($"Merge failed with error...: {ex.Message}", ex);

            }
            return fileContents;
        }


    }
}
