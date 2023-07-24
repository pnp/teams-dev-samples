using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Models;
public class QuizResults
{
    public string QuizId { get; set; }
    public IEnumerable<UserResult> UserResults { get; set; }
}