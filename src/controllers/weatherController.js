import api from "../services/apiClient.js";

export const getCurrentWeather = async (req, res, next) => {
  try {
    const { city } = req.query;
    if (!city) {
      return res.status(400).json({ error: "City parameter is required" });
    }

    const response = await api.get("/weather", {
      params: {
        q: city,
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric"
      }
    });

    res.json(response.data);
  } catch (error) {
    handleWeatherErrors(error, next);
  }
};

export const getForecastById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await api.get("/forecast", {
      params: {
        id,
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric"
      }
    });

    res.json(response.data);
  } catch (error) {
    handleWeatherErrors(error, next);
  }
};

function handleWeatherErrors(error, next) {
  if (error.response?.status === 404) {
    error.message = "City not found or invalid City ID";
    error.status = 404;
  } else {
    error.message = "Weather API failed or invalid request";
    error.status = 503;
  }
  next(error);
}
