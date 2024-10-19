import express from "express";
import cors from "cors";
import {
  getQuestionsByDifficulty,
  getQuestionById,
} from "./controller/question-controller.js";

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
app.get("/", (_, res) => res.send("Hello World from question-service"));
app.get("/questions/:level?", getQuestionsByDifficulty);
app.get("/question/:id", getQuestionById);

app.listen(process.env.PORT || 8002, () => console.log("question-service listening on port 8002"));
