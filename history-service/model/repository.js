import "dotenv/config";
import mongoose from "mongoose";
import HistoryModel from "./history-model.js";

let mongoDB =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function getHistory(params) {
  return await HistoryModel.find(params);
}

export async function createHistory(params) {
  return await HistoryModel.create(params);
}

export async function getUserHistory(params) {
  return await HistoryModel.find({ username: params });
}
