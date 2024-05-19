export interface IServiceHealthMessage {
    Id: string;
    Title: string;
    Status: string;
    Service: string;
    StatusDesc: string;
    HighImpact: boolean;
    ImpactDescription: string;
    StartDateTime: Date;
    EndDateTime: Date;
    LastModifiedDateTime: Date;
}

