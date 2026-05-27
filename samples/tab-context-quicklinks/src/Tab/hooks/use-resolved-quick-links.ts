import { useMemo } from "react";
import { QuickLinksConfig } from "../models/quick-links-config";
import { ResolvedQuickLinksConfig } from "../models/resolved-quick-links-config";
import { TeamsContext } from "../models/teams-context";
import { resolveQuickLinksConfig } from "../services/config-resolution-service";

export function useResolvedQuickLinks(config: QuickLinksConfig | null, teamsContext: TeamsContext | null) {
  const resolved = useMemo<ResolvedQuickLinksConfig | null>(() => {
    if (!config) {
      return null;
    }

    return resolveQuickLinksConfig(
      config,
      teamsContext?.groupId,
      teamsContext?.channelId
    );
  }, [config, teamsContext?.groupId, teamsContext?.channelId]);

  return resolved;
}
