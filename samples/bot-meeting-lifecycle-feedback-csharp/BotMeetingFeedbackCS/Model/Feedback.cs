namespace BotMeetingFfeedbackCS.Model
{
    public class Feedback
    {
        public string meetingID { get; set; }
        public string[] votedPersons { get; set; }
        public int votes1 { get; set; }
        public int votes2 { get; set; }
        public int votes3 { get; set; }
        public int votes4 { get; set; }
        public int votes5 { get; set; }
    }
}
