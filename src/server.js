import express from "express";
import dotenv from "dotenv";
import weatherRoutes from "./routes/weatherRoutes.js"

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Weather Explorer API Running");
});

app.use("/weather", weatherRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
