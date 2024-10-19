import "dotenv/config";
import mongoose from "mongoose";
import QuestionModel from "./question-model.js";

let mongoDB =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function getQuestionsByDifficulty(params) {
  return await QuestionModel.find(params);
}

export async function getAllQuestions() {
  return await QuestionModel.find({});
}

export async function getQuestionById(params) {
  return await QuestionModel.find(params);
}
