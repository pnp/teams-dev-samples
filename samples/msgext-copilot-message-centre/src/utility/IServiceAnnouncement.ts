/**
 * Represents a service announcement.
 */
export interface IServiceAnnouncement {
  /**
   * The ID of the announcement.
   */
  Id: string;
  /**
   * The title of the announcement.
   */
  Title: string;
  /**
   * The services related to the announcement.
   */
  Services: string[];
  /**
   * The details of the announcement.
   */
  Details: {
    /**
     * The name of the detail.
     */
    Name: string;
    /**
     * The value of the detail.
     */
    Value: string;
  }[];
  /**
   * The tags associated with the announcement.
   */
  Tags: string[];
  /**
   * Indicates if the announcement is a major change.
   */
  IsMajorChange: boolean;
  /**
   * The start date and time of the announcement.
   */
  StartDateTime: string;
  /**
   * The end date and time of the announcement.
   */
  EndDateTime: string;
  /**
   * The last modified date and time of the announcement.
   */
  LastModifiedDateTime: string;
  /**
     * Indicates the users following the health message.
    */
  FollowedBy: string[];
  /**
   * The ID of the item.
   */
  ItemId: number;
}