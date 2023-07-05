using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PDFConversion.Models
{
    public class RequestDetail
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int? Size { get; set; }
        public string Type { get; set; }
        public string Content { get; set; }
        public byte[]? Bytes { get; set; }
    }
}
