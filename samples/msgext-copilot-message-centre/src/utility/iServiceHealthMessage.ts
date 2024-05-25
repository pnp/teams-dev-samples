/**
 * Represents a service health message.
 */
export interface IServiceHealthMessage {
    /**
     * The ID of the health message.
     */
    Id: string;

    /**
     * The title of the health message.
     */
    Title: string;

    /**
     * The status of the health message.
     */
    Status: string;

    /**
     * The service associated with the health message.
     */
    Service: string;

    /**
     * The description of the status.
     */
    StatusDesc: string;

    /**
     * Indicates if the health message has high impact.
     */
    HighImpact: boolean;

    /**
     * The description of the impact.
     */
    ImpactDescription: string;

    /**
     * The start date and time of the health message.
     */
    StartDateTime: Date;

    /**
     * The end date and time of the health message.
     */
    EndDateTime: Date;

    /**
     * The last modified date and time of the health message.
     */
    LastModifiedDateTime: Date;

    /**
     * Indicates the users following the health message.
     */
    FollowedBy: string[];

    /**
     * The item ID of the health message.
     */
    ItemId: number;
}

