using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageExtension_SP.Models
{
    public class UserModel
    {
        public string userid { get; set; }
        public string displayName { get; set; }
        public string mail { get; set; }
    }

    public class TeamMembersModel
    {
        public string userId { get; set; }
        public string displayName { get; set; }
        public string[] role { get;set; }
        public string emailId { get; set; }
    }
}
