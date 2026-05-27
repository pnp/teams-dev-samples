import { Text } from "@fluentui/react";
import { ConfigSource } from "../../enums/config-source";

import "./Header.css";

interface HeaderProps {
  title: string;
  description?: string;
  source: ConfigSource;
  channelDisplayName?: string;
}

function getBadgeLabel(source: ConfigSource) {
  switch (source) {
    case ConfigSource.Channel:
      return "Channel";
    case ConfigSource.Team:
      return "Team";
    case ConfigSource.Default:
      return "Default";
  }
}

function resolveTitle(props: HeaderProps) {
  if (props.channelDisplayName) {
    return `${props.channelDisplayName} QuickLinks`;
  }
  return props.title;
}

export default function Header({ title, description, source, channelDisplayName }: HeaderProps) {
  const resolvedTitle = resolveTitle({ title, description, source, channelDisplayName });
  const badgeLabel = getBadgeLabel(source);
  const showBadge = source !== ConfigSource.Default;

  return (
    <header className="header">
      <div className="header-title-row">
        <Text as="h1" variant="xLarge" className="header-title">
          {resolvedTitle}
        </Text>
        {showBadge && (
          <span className={`header-badge header-badge--${source}`} aria-label={`Configuration source: ${badgeLabel}`}>{badgeLabel}</span>
        )}
      </div>
      {description && (
        <Text className="header-description" block>
          {description}
        </Text>
      )}
    </header>
  );
}
