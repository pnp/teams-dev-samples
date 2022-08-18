import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/meetingDetailsTab/index.html")
@PreventIframe("/meetingDetailsTab/config.html")
@PreventIframe("/meetingDetailsTab/remove.html")
export class MeetingDetailsTab {
}
