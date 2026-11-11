import { FontIcon, Text } from "@fluentui/react";

import "./EmptyState.css";

interface EmptyStateProps {
  iconName: string;
  title: string;
  message: string;
}

export default function EmptyState({ iconName, title, message }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <FontIcon iconName={iconName} className="empty-state-icon" />
      <Text as="h2" variant="large" className="empty-state-title">
        {title}
      </Text>
      <Text className="empty-state-message" block>
        {message}
      </Text>
    </div>
  );
}
