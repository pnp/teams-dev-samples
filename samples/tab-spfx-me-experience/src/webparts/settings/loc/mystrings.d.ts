declare interface ISettingsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'SettingsWebPartStrings' {
  const strings: ISettingsWebPartStrings;
  export = strings;
}
