import api from "../services/appClient.js";
import { getCached, setCached } from "../services/cacheService.js";

function getApiKey() {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    const error = new Error("OPENWEATHER_API_KEY is not set in the environment");
    error.status = 500;
    throw error;
  }
  return apiKey;
}

export const getCurrentWeather = async (req, res, next) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: "City parameter is required" });
    }

    const cacheKey = `current:${city.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await api.get("/weather", {
      params: {
        q: city,
        appid: getApiKey(),
        units: "metric"
      }
    });

    setCached(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    handleWeatherErrors(error, next);
  }
};

export const getForecastById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const cacheKey = `forecast:${id}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const response = await api.get("/forecast", {
      params: {
        id,
        appid: getApiKey(),
        units: "metric"
      }
    });

    setCached(cacheKey, response.data);
    res.json(response.data);
  } catch (error) {
    handleWeatherErrors(error, next);
  }
};

function handleWeatherErrors(error, next) {
  if (error.response) {
    const { status, data } = error.response;

    if (status === 404) {
      error.message = data?.message || "City not found or invalid City ID";
      error.status = 404;
    } else {
      error.message = data?.message || "Weather API failed or invalid request";
      error.status = status || 503;
    }
  } else {
    error.message = "Unable to reach Weather API";
    error.status = 503;
  }
  next(error);
}
