// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

using System.Security.Authentication;
using System.Security.Claims;
using Microsoft.Graph.Models;

namespace GraphSample
{
    public static class GraphClaimTypes {
        public const string DateFormat = "graph_dateformat";
        public const string Email = "graph_email";
        public const string Photo = "graph_photo";
        public const string TimeZone = "graph_timezone";
        public const string TimeFormat = "graph_timeformat";
    }

    // Helper methods to access Graph user data stored in
    // the claims principal
    public static class GraphClaimsPrincipalExtensions
    {
        public static string GetUserGraphDateFormat(this ClaimsPrincipal claimsPrincipal)
        {
            var claim = claimsPrincipal.FindFirst(GraphClaimTypes.DateFormat);
            return claim == null ? string.Empty : claim.Value;
        }

        public static string GetUserGraphEmail(this ClaimsPrincipal claimsPrincipal)
        {
            var claim = claimsPrincipal.FindFirst(GraphClaimTypes.Email);
            return claim == null ? string.Empty : claim.Value;
        }

        public static string? GetUserGraphPhoto(this ClaimsPrincipal claimsPrincipal)
        {
            var claim = claimsPrincipal.FindFirst(GraphClaimTypes.Photo);
            return claim == null ? null : claim.Value;
        }

        public static string GetUserGraphTimeZone(this ClaimsPrincipal claimsPrincipal)
        {
            var claim = claimsPrincipal.FindFirst(GraphClaimTypes.TimeZone);
            return claim == null ? string.Empty : claim.Value;
        }

        public static string GetUserGraphTimeFormat(this ClaimsPrincipal claimsPrincipal)
        {
            var claim = claimsPrincipal.FindFirst(GraphClaimTypes.TimeFormat);
            return claim == null ? string.Empty : claim.Value;
        }

        // Adds claims from the provided User object
        public static void AddUserGraphInfo(this ClaimsPrincipal claimsPrincipal, User user)
        {
            var identity = claimsPrincipal.Identity as ClaimsIdentity;
            if (identity == null)
            {
                throw new AuthenticationException(
                    "ClaimsIdentity is null inside provided ClaimsPrincipal");
            }

            identity.AddClaim(
                new Claim(GraphClaimTypes.DateFormat,
                    user.MailboxSettings?.DateFormat ?? "MMMM dd, yyyy"));
            identity.AddClaim(
                new Claim(GraphClaimTypes.Email,
                    user.Mail ?? user.UserPrincipalName ?? ""));
            identity.AddClaim(
                new Claim(GraphClaimTypes.TimeZone,
                    user.MailboxSettings?.TimeZone ?? "UTC"));
            identity.AddClaim(
                new Claim(GraphClaimTypes.TimeFormat,
                    user.MailboxSettings?.TimeFormat ?? "HH:mm"));
        }

        // Converts a photo Stream to a Data URI and stores it in a claim
        public static void AddUserGraphPhoto(this ClaimsPrincipal claimsPrincipal, Stream? photoStream)
        {
            var identity = claimsPrincipal.Identity as ClaimsIdentity;
            if (identity == null)
            {
                throw new AuthenticationException(
                    "ClaimsIdentity is null inside provided ClaimsPrincipal");
            }

            if (photoStream != null)
            {
                // Copy the photo stream to a memory stream
                // to get the bytes out of it
                var memoryStream = new MemoryStream();
                photoStream.CopyTo(memoryStream);
                var photoBytes = memoryStream.ToArray();

                // Generate a date URI for the photo
                var photoUri = $"data:image/png;base64,{Convert.ToBase64String(photoBytes)}";

                identity.AddClaim(
                    new Claim(GraphClaimTypes.Photo, photoUri));
            }
        }
    }
}
