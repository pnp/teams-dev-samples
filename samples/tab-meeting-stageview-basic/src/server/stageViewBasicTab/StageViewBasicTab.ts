import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/stageViewBasicTab/index.html")
@PreventIframe("/stageViewBasicTab/config.html")
@PreventIframe("/stageViewBasicTab/remove.html")
export class StageViewBasicTab {
}
