// <copyright file="Validator.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Validate
{
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// Validator model
    /// </summary>
    public static class Validator
    {
        /// <summary>
        /// validates email
        /// </summary>
        /// <param name="address">email address</param>
        /// <returns>return true if valid email address</returns>
        public static bool IsValidEmailAddress(this string address) => address != null && new EmailAddressAttribute().IsValid(address);
    }
}
