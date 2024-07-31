using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace O365C.FuncApp.ProductCatalog.Models
{
    public class Product
    {
        public string SKUID { get; set; }
        public string Catalogue { get; set; }
        public string ProductName { get; set; }
        public string ProductDescription { get; set; }
        public string RevenueType { get; set; }
        public string PLPostingGroup { get; set; }  
        public string ServiceArea { get; set; }
        public string ServiceGroup {get; set;}
        public string ServiceAreaOwner { get; set; }
        public List<RelatedDocument> Documents { get; set; }
        
        

    }
}
