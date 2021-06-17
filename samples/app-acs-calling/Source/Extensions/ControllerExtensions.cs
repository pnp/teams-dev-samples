// <copyright file="ControllerExtensions.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Microsoft.AspNetCore.Mvc
{
    using System;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Primitives;
    using Microsoft.Graph;

    /// <summary>
    /// The controller exceptions.
    /// </summary>
    public static class ControllerExtensions
    {
        /// <summary>
        /// Convert the status code, content of HttpResponseMessage to IActionResult,
        /// and copy the headers from response to HttpContext.Response.Headers.
        /// </summary>
        /// <param name="controller">The HttpResponse instance.</param>
        /// <param name="responseMessage">The HTtpResponseMessage instance.</param>
        /// <returns>The action result.</returns>
        public static async Task<IActionResult> GetActionResultAsync(this Controller controller, HttpResponseMessage responseMessage)
        {
            var response = controller.HttpContext.Response;

            controller.CopyResponseHeaders(responseMessage.Headers);

            var statusCode = (int)responseMessage.StatusCode;

            if (responseMessage.Content == null)
            {
                return controller.StatusCode(statusCode);
            }
            else
            {
                var responseBody = await responseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);

                return controller.StatusCode(statusCode, responseBody);
            }
        }

        /// <summary>
        /// Convert exception to action result.
        /// </summary>
        /// <param name="controller">The controller.</param>
        /// <param name="exception">The exception.</param>
        /// <returns>The action result.</returns>
        public static IActionResult Exception(this Controller controller, Exception exception)
        {
            IActionResult result;

            if (exception is ServiceException e)
            {
                controller.CopyResponseHeaders(e.ResponseHeaders);

                int statusCode = (int)e.StatusCode;

                result = statusCode >= 300
                    ? controller.StatusCode(statusCode, e.ToString())
                    : controller.StatusCode((int)HttpStatusCode.InternalServerError, e.ToString());
            }
            else
            {
                result = controller.StatusCode((int)HttpStatusCode.InternalServerError, exception.ToString());
            }

            return result;
        }

        /// <summary>
        /// Copy the response headers to controller.HttpContext.Response.
        /// </summary>
        /// <param name="controller">The controller.</param>
        /// <param name="responseHeaders">The response headers.</param>
        private static void CopyResponseHeaders(this Controller controller, HttpResponseHeaders responseHeaders)
        {
            if (responseHeaders == null)
            {
                // do nothing as the source headers are null.
                return;
            }

            foreach (var header in responseHeaders)
            {
                controller.HttpContext.Response.Headers.Add(header.Key, new StringValues(header.Value?.ToArray()));
            }
        }
    }
}
