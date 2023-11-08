import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/meetingDataTab/index.html")
@PreventIframe("/meetingDataTab/config.html")
@PreventIframe("/meetingDataTab/remove.html")
export class MeetingDataTab {
}
