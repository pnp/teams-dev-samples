using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text;

[assembly: FunctionsStartup(typeof(PDFConversion.Startup))]

namespace PDFConversion
{
    public class Startup : FunctionsStartup
    {
        public override void Configure(IFunctionsHostBuilder builder)
        {                      
            //Register the code page provider
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
        }        
    }
}