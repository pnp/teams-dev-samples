import * as React from "react";
import { MessageBar, MessageBarType } from "office-ui-fabric-react";
export interface MessageBarProps {
  message?: string;
}

const TopMessageBar: React.FC<MessageBarProps> = (props) => {
  const officeAddinTaskpaneStyle = { marginBottom: "10px" };

  return (
    <div style={officeAddinTaskpaneStyle}>
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={true}
          truncated={true}
          dismissButtonAriaLabel="Close"
        >
          {props.message}
        </MessageBar>     
    </div>
  );
};

export default TopMessageBar;
