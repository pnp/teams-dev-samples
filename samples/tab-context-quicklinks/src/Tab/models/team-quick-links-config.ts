import { QuickLinksAreaConfig } from "./quick-links-area-config";

export interface TeamQuickLinksConfig extends QuickLinksAreaConfig {
  channels?: Record<string, QuickLinksAreaConfig>;
}
