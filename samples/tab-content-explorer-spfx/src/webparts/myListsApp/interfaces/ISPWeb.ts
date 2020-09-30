
export interface ISPWeb {
  Id: string;
  ServerRelativeUrl: string;
  Url: string;
  Title: string;
}

export interface ISiteInfo {
  Title: string;
  Path: string;
  DepartmentId?: string;
  SiteId: string;
  SubSites?: ISiteInfo[];
}
