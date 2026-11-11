import { app } from "@microsoft/teams-js";
import { useCallback, useEffect, useState } from "react";
import { LoadingState } from "../enums/loading-state";
import { TeamsContext } from "../models/teams-context";

function applyThemeToDocument(theme: string) {
  const resolved = theme === "dark" ? "dark" : theme === "contrast" ? "contrast" : "light";
  document.documentElement.setAttribute("data-theme", resolved);
}

export function useTeamsContext() {
  const [teamsContext, setTeamsContext] = useState<TeamsContext | null>(null);
  const [loadingState, setLoadingState] = useState(LoadingState.Loading);

  const handleThemeChange = useCallback((newTheme: string) => {
    applyThemeToDocument(newTheme);
    setTeamsContext((prev) => (prev ? { ...prev, theme: newTheme } : prev));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        await app.initialize();

        const context = await app.getContext();

        if (cancelled) {
          return;
        }

        const theme = context.app.theme ?? "default";
        applyThemeToDocument(theme);

        app.registerOnThemeChangeHandler(handleThemeChange);

        setTeamsContext({
          groupId: context.team?.groupId,
          channelId: context.channel?.id,
          userObjectId: context.user?.id,
          teamDisplayName: context.team?.displayName,
          channelDisplayName: context.channel?.displayName,
          theme,
        });
        setLoadingState(LoadingState.Loaded);
      } catch {
        if (cancelled) {
          return;
        }
        // TeamsJS initialization failed — likely not running inside Teams.
        // Fall back to a minimal default context so the app still works.
        console.info("TeamsJS initialization failed. Using default context.");
        applyThemeToDocument("default");
        setTeamsContext({
          theme: "default",
        });
        setLoadingState(LoadingState.Loaded);
      }
    }

    initialize();

    return () => {
      cancelled = true;
    };
  }, [handleThemeChange]);

  return { teamsContext, loadingState };
}
