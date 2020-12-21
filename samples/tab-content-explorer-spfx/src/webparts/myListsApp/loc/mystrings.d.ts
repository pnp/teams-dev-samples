declare interface IMyListsAppWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  SiteFieldPlaceholder: string;
  WebPartNotConfigured: string;
  ListsFilterGroupName: string;
  IncludeDocLibrariesLabel: string;
  IncludeEventListsLabel: string;
  IncludeCustomListsLabel: string;
  IncludeSystemLibrariesLabel: string;
  SubsiteFilterGroupName: string;
  LinksBehaviourGroupName: string;
  OpenLinksInTeamsLabel: string;
  IncludeSubsitesLabel: string;
  DisplaySettingsGroupName: string;
  LayoutLabel: string;
}

declare module 'MyListsAppWebPartStrings' {
  const strings: IMyListsAppWebPartStrings;
  export = strings;
}
