import { FontIcon, IconButton, Text, TooltipHost } from "@fluentui/react";
import { QuickLink } from "../../models/quick-link";
import { openLink } from "../../services/link-opening-service";
import { isHttpUrl } from "../../utils/url-utils";

import "./LinkCard.css";

interface LinkCardProps {
  link: QuickLink;
  isPinned: boolean;
  onTogglePin: (linkId: string) => void;
}

export default function LinkCard({ link, isPinned, onTogglePin }: LinkCardProps) {
  const httpWarning = isHttpUrl(link.url);

  function handleCardClick() {
    openLink(link.url);
  }

  function handleCardKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openLink(link.url);
    }
  }

  return (
    <div
      className="link-card"
      role="listitem"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      aria-label={`Open ${link.title}${httpWarning ? " (insecure HTTP link)" : ""}`}
    >
      <div className="link-card-content">
        {link.icon && (
          <div className="link-card-icon">
            <FontIcon iconName={link.icon} className="link-card-icon-glyph" />
          </div>
        )}
        <div className="link-card-text">
          <div className="link-card-title-row">
            <Text className="link-card-title" block>
              {link.title}
            </Text>
            {httpWarning && (
              <TooltipHost content="This link uses an insecure HTTP connection.">
                <FontIcon iconName="Info" className="link-card-http-warning" />
              </TooltipHost>
            )}
          </div>
          {link.description && (
            <Text className="link-card-description" block>
              {link.description}
            </Text>
          )}
        </div>
      </div>
      <div className="link-card-actions">
        <IconButton
          iconProps={{ iconName: isPinned ? "Unpin" : "Pin" }}
          title={isPinned ? "Unpin this link" : "Pin this link"}
          ariaLabel={isPinned ? `Unpin ${link.title}` : `Pin ${link.title}`}
          className={`link-card-pin ${isPinned ? "link-card-pin--active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin(link.id);
          }}
        />
      </div>
    </div>
  );
}
