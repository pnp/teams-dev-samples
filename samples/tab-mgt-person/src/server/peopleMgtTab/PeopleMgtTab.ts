import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/peopleMgtTab/index.html")
@PreventIframe("/peopleMgtTab/config.html")
@PreventIframe("/peopleMgtTab/remove.html")
export class PeopleMgtTab {
}
