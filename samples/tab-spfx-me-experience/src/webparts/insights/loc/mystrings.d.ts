declare interface IInsightsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
   // Relative date strings
   DateJustNow: string;
   DateMinute: string;
   DateMinutesAgo: string;
   DateHour: string;
   DateHoursAgo: string;
   DateDay: string;
   DateDaysAgo: string;
   DateWeeksAgo: string;
}

declare module 'InsightsWebPartStrings' {
  const strings: IInsightsWebPartStrings;
  export = strings;
}
