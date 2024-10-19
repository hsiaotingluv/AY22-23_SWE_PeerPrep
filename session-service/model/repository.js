import "dotenv/config";
import mongoose from "mongoose";
import SessionModel from "./session-model.js";

let mongoDB =
  process.env.ENV == "PROD"
    ? process.env.DB_CLOUD_URI
    : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export async function createSession(params) {
  return await SessionModel.create(params);
}

export async function getSessionByUsername(filter) {
  return await SessionModel.find(filter);
}

export async function updateSession(filter, update) {
  return await SessionModel.findOneAndUpdate(filter, update);
}

export async function cleanUpSessions() {
  console.log("cleaning up completed sessions...");
  return await SessionModel.deleteMany({
    userStatus1: false,
    userStatus2: false,
  });
}
