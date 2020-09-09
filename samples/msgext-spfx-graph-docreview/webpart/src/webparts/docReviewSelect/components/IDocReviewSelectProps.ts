import { IMicrosoftTeams } from "@microsoft/sp-webpart-base";
import { ServiceScope } from "@microsoft/sp-core-library";

export interface IDocReviewSelectProps {
  serviceScope: ServiceScope;
  siteUrl: string;
  teamsContext?: IMicrosoftTeams;
  isTeamsMessagingExtension: boolean;
}
