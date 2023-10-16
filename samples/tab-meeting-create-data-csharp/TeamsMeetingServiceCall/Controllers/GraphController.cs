using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph;
using Microsoft.Identity.Web;
using TeamsMeetingServiceCall.controller;
using TeamsMeetingServiceCall.Models;

namespace TeamsMeetingServiceCall.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GraphController : ControllerBase
    {
        private readonly GraphServiceClient _graphClient;
        private readonly ITokenAcquisition _tokenAcquisition;
        private readonly ILogger<GraphController> _logger;
        public GraphController(ITokenAcquisition tokenAcquisition, GraphServiceClient graphClient, ILogger<GraphController> logger)
        {
            _tokenAcquisition = tokenAcquisition;
            _graphClient = graphClient;
            _logger = logger;
        }
        
        public async Task<CustomerData> Get(string plainChatId)
        {            
            CustomerData result = await this.GetCustomMeetingData(plainChatId);
            return result;
        }
        private async Task<CustomerData> GetCustomMeetingData(string meetingId)
        {
            AzureController azrCtrl = new AzureController("Endpoint=https://mmoteamsconfiguration.azconfig.io;Id=/nk1-l9-s0:JJRg85Y6Y+GzQ1rRLdzf;Secret=wX+jBL/p0WwB/3Z8SGVP8rMsQ8t1DcZC+te5wK84nuw="); // ToDo!!         
            string customerName = azrCtrl.GetConfigurationValue($"TEAMSMEETINGSERVICECALL:{meetingId}:CUSTOMERNAME") ?? "No customername";
            string customerPhone = azrCtrl.GetConfigurationValue($"TEAMSMEETINGSERVICECALL:{meetingId}:CUSTOMERPHONE") ?? "No customerphone";
            string customerEmail = azrCtrl.GetConfigurationValue($"TEAMSMEETINGSERVICECALL:{meetingId}:CUSTOMEREMAIL") ?? "No customeremail";
            string customerId = azrCtrl.GetConfigurationValue($"TEAMSMEETINGSERVICECALL:{meetingId}:CUSTOMERID") ?? "No customerid";

            CustomerData customerData = new CustomerData
            {
                Name = customerName,
                Phone = customerPhone,
                Email = customerEmail,
                Id = customerId
            };
            return customerData;
        }

        private async Task<CustomerData> GetCustomMeetingDataDB(string meetingId)
        {
            AzureTableController azureTableController = new AzureTableController();
            CustomerData customerData = azureTableController.GetCustomer(meetingId);            
            return customerData;
        }
    }
}
