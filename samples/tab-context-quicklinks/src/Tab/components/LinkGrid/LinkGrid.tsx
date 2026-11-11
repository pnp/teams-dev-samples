import { QuickLink } from "../../models/quick-link";
import EmptyState from "../EmptyState/EmptyState";
import LinkCard from "../LinkCard/LinkCard";

import "./LinkGrid.css";

interface LinkGridProps {
  links: QuickLink[];
  pinnedIds: string[];
  onTogglePin: (linkId: string) => void;
  isSearchResult?: boolean;
}

function isValidLink(link: QuickLink) {
  if (!link.id || !link.title || !link.url) {
    console.info("Skipping link with missing required fields:", link);
    return false;
  }
  return true;
}

export default function LinkGrid({ links, pinnedIds, onTogglePin, isSearchResult }: LinkGridProps) {
  const validLinks = links.filter(isValidLink);
  const pinnedSet = new Set(pinnedIds);

  if (validLinks.length === 0) {
    if (isSearchResult) {
      return (
        <EmptyState
          iconName="SearchIssue"
          title="No results found"
          message="No links match your search. Try a different search term."
        />
      );
    }

    return (
      <EmptyState
        iconName="Link"
        title="No links available"
        message="There are no links configured for this context."
      />
    );
  }

  return (
    <div className="link-grid" role="list" aria-label="Links">
      {validLinks.map((link) => (
        <LinkCard
          key={link.id}
          link={link}
          isPinned={pinnedSet.has(link.id)}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  );
}
