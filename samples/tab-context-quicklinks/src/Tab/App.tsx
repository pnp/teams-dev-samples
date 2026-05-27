import { MessageBar, MessageBarType, SearchBox, Spinner, SpinnerSize, Text } from "@fluentui/react";
import { useMemo, useState } from "react";
import Header from "./components/Header/Header";
import LinkGrid from "./components/LinkGrid/LinkGrid";
import { LoadingState } from "./enums/loading-state";
import { usePinnedLinks } from "./hooks/use-pinned-links";
import { useQuickLinksConfig } from "./hooks/use-quick-links-config";
import { useResolvedQuickLinks } from "./hooks/use-resolved-quick-links";
import { useTeamsContext } from "./hooks/use-teams-context";
import { deduplicateLinks } from "./utils/deduplicate-links";
import { searchLinks } from "./utils/search-links";

import "./App.css";

export default function App() {
  const { teamsContext, loadingState: contextLoadingState } = useTeamsContext();
  const { config, loadingState: configLoadingState, error } = useQuickLinksConfig();
  const resolved = useResolvedQuickLinks(config, teamsContext);

  const [searchQuery, setSearchQuery] = useState("");

  const links = useMemo(() => {
    if (!resolved) {
      return [];
    }
    return deduplicateLinks(resolved.area.links ?? []);
  }, [resolved]);

  const { pinnedLinks, unpinnedLinks, pinnedIds, togglePin } = usePinnedLinks(links, teamsContext?.userObjectId, teamsContext?.groupId, teamsContext?.channelId);

  const filteredUnpinnedLinks = useMemo(() => {
    return searchLinks(unpinnedLinks, searchQuery);
  }, [unpinnedLinks, searchQuery]);

  const isSearchActive = searchQuery.trim().length > 0;

  const isLoading = contextLoadingState === LoadingState.Loading || configLoadingState === LoadingState.Loading;

  function handleSearchChange(_event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) {
    setSearchQuery(newValue ?? "");
  }

  function handleSearchClear() {
    setSearchQuery("");
  }

  return (
    <div className="app" role="main">
      {isLoading && (
        <div className="app-centered" aria-live="polite">
          <Spinner size={SpinnerSize.large} label="Loading QuickLinks..." />
        </div>
      )}

      {!isLoading && configLoadingState === LoadingState.Error && (
        <div className="app-message" role="alert">
          <MessageBar messageBarType={MessageBarType.error}>
            {error}
          </MessageBar>
        </div>
      )}

      {!isLoading && configLoadingState === LoadingState.Loaded && resolved && (
        <div className="app-content">
          <Header
            title={resolved.area.title}
            description={resolved.area.description}
            source={resolved.source}
            channelDisplayName={teamsContext?.channelDisplayName}
          />
          <div className="app-search">
            <SearchBox
              placeholder="Search links..."
              value={searchQuery}
              onChange={handleSearchChange}
              onClear={handleSearchClear}
              ariaLabel="Search links"
            />
          </div>
          {pinnedLinks.length > 0 && (
            <section className="app-pinned-section" aria-label="Pinned links">
              <Text as="h2" variant="mediumPlus" className="app-section-title">
                Pinned
              </Text>
              <LinkGrid
                links={pinnedLinks}
                pinnedIds={pinnedIds}
                onTogglePin={togglePin}
              />
            </section>
          )}
          <section aria-label="All links">
            <LinkGrid
              links={filteredUnpinnedLinks}
              pinnedIds={pinnedIds}
              onTogglePin={togglePin}
              isSearchResult={isSearchActive}
            />
          </section>
        </div>
      )}
    </div>
  );
}
