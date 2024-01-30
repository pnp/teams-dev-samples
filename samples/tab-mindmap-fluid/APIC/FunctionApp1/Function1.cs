using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace FunctionApp1
{
    public static class Function1
    {
        private static readonly string key = "FRS";
        [FunctionName("GetToken")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get",  Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            string tenantId = req.Query["tenantId"].ToString() ;
            string documentId = req.Query["documentId"].ToString() ;
            string userId = req.Query["userId"].ToString() ;
            string userName = req.Query["userName"].ToString() ;
            //string[] scopes = req.Query["scopes"].ToString().Split(",") ;

            if (string.IsNullOrEmpty(tenantId))
            {
                return new BadRequestObjectResult("No tenantId provided in query params");
            }

            if (string.IsNullOrEmpty(Environment.GetEnvironmentVariable(key)))
            {
                return new NotFoundObjectResult($"No key found for the provided tenantId: ${tenantId}");
            }

            //  If a user is not specified, the token will not be associated with a user, and a randomly generated mock user will be used instead
            var user = (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(userId)) ?
                new { name = Guid.NewGuid().ToString(), id = Guid.NewGuid().ToString() } :
                new { name = userName, id = userId };

            // Will generate the token and returned by an ITokenProvider implementation to use with the AzureClient.
            string token = GenerateToken(
                tenantId,
                Environment.GetEnvironmentVariable(key),
                 new string[] { "doc:read", "doc:write", "summary:write" },
                documentId,
                user
            );

            return new OkObjectResult(token);
        }

        private static string GenerateToken(string tenantId, string key, string[] scopes, string? documentId, dynamic user, int lifetime = 3600, string ver = "1.0")
        {
            string docId = documentId ?? "";
            DateTime now = DateTime.Now;

            SigningCredentials credentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256);

            JwtHeader header = new JwtHeader(credentials);
            JwtPayload payload = new JwtPayload
            {
                { "documentId", docId },
                { "scopes", scopes },
                { "tenantId", tenantId },
                { "user", user },
                { "iat", new DateTimeOffset(now).ToUnixTimeSeconds() },
                { "exp", new DateTimeOffset(now.AddSeconds(lifetime)).ToUnixTimeSeconds() },
                { "ver", ver },
                { "jti", Guid.NewGuid() }
            };

            JwtSecurityToken token = new JwtSecurityToken(header, payload);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
