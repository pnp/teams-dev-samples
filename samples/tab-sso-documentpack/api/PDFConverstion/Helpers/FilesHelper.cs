using PdfSharp.Pdf.IO;
using PdfSharp.Pdf;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using PDFConversion.Models;

namespace PDFConverstion.Helpers
{
    public class FilesHelper
    {
        public static Stream ConvertBase64ToFileStream(string base64encodedstring){
            var cleanedBase64Str = base64encodedstring.Substring(base64encodedstring.LastIndexOf(',') + 1);
            var bytes = Convert.FromBase64String(cleanedBase64Str);
            Stream stream = new MemoryStream(bytes);           
            return stream;
        }
        public static void MergeFile(PdfDocument masterPdf, RequestDetail doc)
        {

            using (MemoryStream fileStream = new MemoryStream(doc.Bytes))
            {
                PdfDocument tempDoc = PdfReader.Open(fileStream, PdfDocumentOpenMode.Import);

                for (int i = 0; i < tempDoc.PageCount; i++)
                {
                    PdfPage page = tempDoc.Pages[i];
                    masterPdf.AddPage(page);
                }
            }

        }
    }
}
