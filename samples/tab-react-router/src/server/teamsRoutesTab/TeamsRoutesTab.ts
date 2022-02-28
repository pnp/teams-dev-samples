import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/teamsRoutesTab/index.html")
@PreventIframe("/teamsRoutesTab/config.html")
@PreventIframe("/teamsRoutesTab/remove.html")
export class TeamsRoutesTab {
}
