export interface ILocation {
  name: string;
  localNames: {
    [languageCode: string]: string;
  };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
