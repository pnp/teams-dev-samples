using System;
namespace SharedModels.Models;


public class AssessmentAIResponse{
    public bool IsAssessmentInvitation {get; set;}
    public AssessmentType? Type { get; set; }
    public AssessmentStatus? Status { get; set; }
    public string? AssessmentDate {get; set;}
    public string? CustomDescription {get; set;}

    public override string ToString()
    {
        return $"IsInvitation: {IsAssessmentInvitation}, Type: {Type}, Status: {Status}, AssessmentDate: {AssessmentDate}, CustomDescroption: {CustomDescription}";
    }
}