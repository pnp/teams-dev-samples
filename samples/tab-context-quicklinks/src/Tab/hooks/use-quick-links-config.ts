import { useEffect, useState } from "react";
import { LoadingState } from "../enums/loading-state";
import { QuickLinksConfig } from "../models/quick-links-config";
import { loadQuickLinksConfig } from "../services/config-service";
import { validateConfig } from "../utils/validate-config";

export function useQuickLinksConfig() {
  const [config, setConfig] = useState<QuickLinksConfig | null>(null);
  const [loadingState, setLoadingState] = useState(LoadingState.Loading);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await loadQuickLinksConfig();

        if (cancelled) {
          return;
        }

        if (!validateConfig(data)) {
          setError("The QuickLinks configuration is invalid. The 'default' key is required.");
          setLoadingState(LoadingState.Error);
          return;
        }

        setConfig(data);
        setLoadingState(LoadingState.Loaded);
      } catch (error) {
        if (cancelled) {
          return;
        }
        const message = error instanceof Error ? error.message : "An unknown error occurred.";
        setError(`The QuickLinks configuration could not be loaded. Please check /config/quicklinks.json. ${message}`);
        setLoadingState(LoadingState.Error);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { config, loadingState, error };
}
