
export interface IHubSite {
  title: string;
  path: string;
  siteId: string;
  webId: string;
  groupId?: string;
  subSites?: IHubSite[];
}

export interface IHubSitesResponse {
  Items: IHubSiteResponseItem[];
  Type: string;
} 

export interface IHubSiteResponseItem {
  ItemReference: IItemReference;
  Acronym: string;
  BannerImageUrl: string;
  BannerColor: string;
  ContentTypeId: string;
  WebTemplate: string;
  Id: string;
  Url: string;
  OriginalUrl: string;
  Title: string;
  Type: string;
}

export interface IItemReference {
  GroupId?: string;
  WebId: string;
  IndexId: number;
  ExchangeId: string;
  Source: string;
  SiteId: string;
  Type: string;
}
