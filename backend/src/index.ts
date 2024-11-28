// src/index.ts

import express from "express";
import dotenv from "dotenv";
import rideRoutes from "./routes/rideRoutes";
import cors from "cors";

import { Session } from "node:inspector/promises";
import { writeFile } from "node:fs/promises";
import { sign } from "node:crypto";

import path from "path";

// Carrega o .env na raiz do projeto
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Ou, se estiver na raiz do projeto
dotenv.config();

console.log("Database URL:", process.env.DATABASE_URL);

function cpuProfilling() {
  let _session: Session;
  return {
    async start() {
      _session = new Session();
      _session.connect();
      await _session.post("Profiler.enable");
      await _session.post("Profiler.start");
      console.log("started cpu profilling");
    },
    async stop() {
      console.log("stopping cpu proffiling");
      const { profile } = await _session.post("Profiler.stop");
      const profileName = `cpu-profile-${Date.now()}.cpuprofile`;
      await writeFile(profileName, JSON.stringify(profile));
      _session.disconnect();
    },
  };
}

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

const { start, stop } = cpuProfilling();
start();
const exitSignals = ["SIGNIT", "SIGTERM", "SIGQUIT"];

exitSignals.forEach((signal) => {
  process.once(signal, async () => {
    await stop();
    process.exit(0);
  });
});
