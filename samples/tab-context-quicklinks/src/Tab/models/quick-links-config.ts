import { QuickLinksAreaConfig } from "./quick-links-area-config";
import { TeamQuickLinksConfig } from "./team-quick-links-config";

export interface QuickLinksConfig {
  default: QuickLinksAreaConfig;
  teams: Record<string, TeamQuickLinksConfig>;
}
