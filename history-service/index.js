import express from "express";
import cors from "cors";
import { getHistory, createHistory } from "./controller/history-controller.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    // config cors so that front-end can use
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: true,
  })
);
app.options("*", cors());

// Endpoints
app.get("/", (_, res) => res.send("Hello World from history-service"));
app.get("/history/:username/:roomId?", getHistory);
app.post("/history/create/:username/", createHistory);

app.listen(process.env.PORT || 8003, () => console.log("history-service listening on port 8003"));
