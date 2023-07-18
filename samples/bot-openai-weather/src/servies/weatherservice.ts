import axios from "axios";
import { ILocation } from "../interfaces/ILocation";
import config from "../internal/config";
import { IDailyForecast, IWeatherData } from "../interfaces/IWeatherData";

const api = axios.create({
  baseURL: "http://api.openweathermap.org",
});

const getCoordinates = async (locationName: string): Promise<ILocation> => {
  try {
    const { data, status } = await api.get<ILocation>(
      `/geo/1.0/direct?q=${locationName}&limit=1&appid=${config.weatherAPIKey}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    } else {
      return {
        lon: 0,
        lat: 0,
      } as ILocation;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
    } else {
      console.log("unexpected error: ", error);
    }
  }
};

const getCurrentWeatherDetail = async (locationName: string) => {
  try {
    const apiEndPoint = `/data/2.5/weather?q=${locationName}&units=metric&appid=${config.weatherAPIKey}`;
    const { data, status } = await api.get<any>(apiEndPoint, {
      headers: {
        Accept: "application/json",
      },
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
};

const getWeatherForecastData = async (
  locationName: string,
  daysForecast: number
) => {
  try {
    let dailyForecastData: IDailyForecast[] = [];

    const locationData = (await getCoordinates(locationName)) as ILocation;

    const apiEndPoint = `/data/3.0/onecall?lat=${locationData.lat}&lon=${locationData.lon}&appid=${config.weatherAPIKey}&exclude=minutely,hourly&units=metric`;

    const { data, status } = await api.get<any>(apiEndPoint, {
      headers: {
        Accept: "application/json",
      },
    });

    dailyForecastData = data.daily.map((day: any) => {
      return {
        date: new Date((day.dt + data.timezone_offset) * 1000).toDateString(),
        imageUrl: `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`,
        description: day.weather[0].main,
        high: day.temp.max.toFixed(),
        low: day.temp.min.toFixed(),
      } as IDailyForecast;
    });

    // Create weather data for card
    const weatherData: IWeatherData = {
      location: `${locationData.name}, ${locationData.country}`,
      currentTemp: data.current.temp.toFixed(),
      currentDescription: data.current.weather[0].main,
      sunrise: new Date(
        (data.current.sunrise + data.timezone_offset) * 1000
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      sunset: new Date(
        (data.current.sunset + data.timezone_offset) * 1000
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      currentHumidity: data.current.humidity,
      currentWindSpeed: data.current.wind_speed.toFixed(),
      currentImageUrl: `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`,
      dailyForecastData:
        daysForecast > 0
          ? dailyForecastData.slice(0, daysForecast)
          : dailyForecastData,
    };
    return weatherData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message);
      return error.message;
    } else {
      console.log("unexpected error: ", error);
      return "An unexpected error occurred";
    }
  }
};

export { getCurrentWeatherDetail, getWeatherForecastData };
