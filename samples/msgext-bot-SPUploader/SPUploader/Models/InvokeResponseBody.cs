using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageExtension_SP.Models
{
    public class InvokeResponseBody
    {
        public int statusCode { get; set; }
        public string type { get; set; }
        public object value { get; set; }
    }
}
