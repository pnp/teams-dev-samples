import { TeamsUserCredential } from "@microsoft/teamsfx";
import { createContext } from "react";
import { Theme } from "@fluentui/react-components";

export const TeamsFxContext = createContext<{
  theme?: Theme;
  themeString: string;
  teamsUserCredential?: TeamsUserCredential;
  context?: any;
}>({
  theme: undefined,
  themeString: "",
  teamsUserCredential: undefined,
  context: undefined
});
