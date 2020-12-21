
export interface ISPSite {
  "@odata.id": string;
  HubSiteId: string;
  Id: string;
  IsHubSite: boolean;
  Url: string;
  RootWeb: RootWeb;
}

export interface RootWeb {
  Title: string;
  Url: string;
}