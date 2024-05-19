/*
    Base an interface from 

    {
      "Id": "MC424414",
      "Title": "(Updated) Non-Native and Hybrid Yammer Networks are being upgraded",
      "Services": [
        "Microsoft Viva"
      ],
      "Details": [
        {
          "Name": "Summary",
          "Value": "Non-Native and Hybrid Yammer Networks will be upgraded to Native Mode, providing compatibility with Azure Active Directory and Microsoft 365, as well as other benefits. The upgrade will begin on December 01, 2022, and continue through late December 2024. Organizations will lose access to certain features, and guests will need to be reinvited to the network. Organizations can self-initiate the migration or Microsoft can initiate it for them. Contact Microsoft 365 support to log an exception for postponing or scheduling the migration around blackout dates."
        },
        {
          "Name": "BlogLink",
          "Value": "https://techcommunity.microsoft.com/t5/blogs/blogworkflowpage/blog-id/YammerBlog/article-id/1660"
        },
        {
          "Name": "ExternalLink",
          "Value": "https://docs.microsoft.com/Yammer/configure-your-yammer-network/nonnative-hybrid"
        }
      ],
      "Tags": [
        "Updated message",
        "Admin impact",
        "Retirement"
      ],
      "IsMajorChange": true,
      "StartDateTime": "2022-09-02T00:53:05+01:00",
      "EndDateTime": "2025-03-03T08:00:00+00:00",
      "LastModifiedDateTime": "2024-02-19T20:53:14.103+00:00"
    }


*/


export interface IServiceAnnouncement {
    Id: string;
    Title: string;
    Services: string[];
    Details: {
        Name: string;
        Value: string;
    }[];
    Tags: string[];
    IsMajorChange: boolean;
    StartDateTime: string;
    EndDateTime: string;
    LastModifiedDateTime: string;
}