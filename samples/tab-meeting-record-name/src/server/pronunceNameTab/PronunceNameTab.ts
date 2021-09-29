import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/pronunceNameTab/index.html")
@PreventIframe("/pronunceNameTab/config.html")
@PreventIframe("/pronunceNameTab/remove.html")
export class PronunceNameTab {
}
