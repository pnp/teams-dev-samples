import { ConfigSource } from "../enums/config-source";
import { QuickLinksConfig } from "../models/quick-links-config";
import { ResolvedQuickLinksConfig } from "../models/resolved-quick-links-config";

export function resolveQuickLinksConfig(config: QuickLinksConfig, groupId?: string, channelId?: string): ResolvedQuickLinksConfig {
  if (groupId && channelId) {
    const channelConfig = config.teams[groupId]?.channels?.[channelId];

    if (channelConfig) {
      return {
        source: ConfigSource.Channel,
        area: channelConfig,
      };
    }
  }

  if (groupId) {
    const teamConfig = config.teams[groupId];

    if (teamConfig) {
      return {
        source: ConfigSource.Team,
        area: teamConfig,
      };
    }
  }

  return {
    source: ConfigSource.Default,
    area: config.default,
  };
}
