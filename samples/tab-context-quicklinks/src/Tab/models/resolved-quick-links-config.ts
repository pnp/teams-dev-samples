import { ConfigSource } from "../enums/config-source";
import { QuickLinksAreaConfig } from "./quick-links-area-config";

export interface ResolvedQuickLinksConfig {
  source: ConfigSource;
  area: QuickLinksAreaConfig;
}
