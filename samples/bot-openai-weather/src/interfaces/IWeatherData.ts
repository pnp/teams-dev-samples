export interface IWeatherData {
  location: string;
  currentTemp: any;
  currentDescription: any;
  sunrise: string;
  sunset: string;
  currentHumidity: any;
  currentWindSpeed: any;
  currentImageUrl: string;
  dailyForecastData: IDailyForecast[];
}
export interface IDailyForecast {
  date: string;
  imageUrl: string;
  description: string;
  title: string;
  high: string;
  low: string;
}
