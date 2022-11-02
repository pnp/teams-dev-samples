using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
namespace TabWithAdpativeCardFlow.Helpers
{
    public static class StringExtensions
    {
        public static string RemoveFirstInstanceOfString(this string value, string removeString)
        {
            int index = value.IndexOf(removeString, StringComparison.Ordinal);
            return index < 0 ? value : value.Remove(index, removeString.Length);
        }
    }
}
