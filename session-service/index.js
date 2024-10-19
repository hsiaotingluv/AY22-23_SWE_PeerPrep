import express from "express";
import cors from "cors";
import {
  createSession,
  getSessionDetails,
  updateUserStatus,
  updateUserAttempt,
} from "./controller/session-controller.js";

const app = express();
const PORT = process.env.PORT || 8004;

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

app.get("/", (_, res) => res.send("Hello World from session-service"));
app.post("/session", createSession);
app.get("/session/:username", getSessionDetails);
app.patch("/session/status/:username", updateUserStatus);
app.patch("/session/attempt/:username", updateUserAttempt);

app.listen(PORT, () =>
  console.log(`session-service listening on port ${PORT}`)
);
