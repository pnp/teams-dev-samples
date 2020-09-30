import { WebPartContext } from "@microsoft/sp-webpart-base";


export interface IMyListsAppProps {
  siteURL: string;
  context: WebPartContext;
  includeDocLibraries: boolean;
  includeEventLists: boolean;
  includeCustomLists: boolean;
  includeSystemLibraries: boolean;
  includeSubsites: boolean;
  openLinksInTeams: boolean;
  displayLayout: string;
}
