import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/contextViewerTab/index.html")
@PreventIframe("/contextViewerTab/config.html")
export class ContextViewerTab {
}
