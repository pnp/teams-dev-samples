import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/adalTab/index.html")
@PreventIframe("/adalTab/config.html")
@PreventIframe("/adalTab/remove.html")
export class AdalTab {
}
