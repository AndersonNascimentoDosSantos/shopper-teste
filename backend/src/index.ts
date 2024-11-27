// src/index.ts

import express from "express";
import dotenv from "dotenv";
import rideRoutes from "./routes/rideRoutes";
import cors from "cors";
dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("", rideRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
