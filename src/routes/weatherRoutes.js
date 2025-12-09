import express from "express";
import { getCurrentWeather, getForecastById } from "../controllers/weatherController.js";



const router = express.Router();

router.get("/current", getCurrentWeather);
router.get("/forecast/:id", getForecastById);



export default router;
