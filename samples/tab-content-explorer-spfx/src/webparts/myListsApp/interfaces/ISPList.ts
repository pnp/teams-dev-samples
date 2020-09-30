
export interface ISPList {
  BaseTemplate: number;
  Id: string;
  ImageUrl: string;
  ItemCount: number;
  ListItemEntityTypeFullName: string;
  LastItemModifiedDate: string;
  Title: string;
  ParentWebUrl: string;
  RootFolder: IRootFolder;
}

export interface IRootFolder {
  ServerRelativeUrl: string;
}