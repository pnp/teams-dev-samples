using Microsoft.AspNetCore.StaticFiles.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MeetingExtension_SP.Models.Sharepoint
{
    public class SPWrapper<T> : SharePointBase
    {
        public T[] Value { get; set; }
    }
}
