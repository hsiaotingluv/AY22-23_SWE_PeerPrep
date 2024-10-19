import UserModel from './user-model.js';
import TokenModel from './token-model.js';
import 'dotenv/config';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createUser(params) {
  return new UserModel(params);
}

// param is a json object with {"username": xxx} or {"username": xxx, "password": xxx}
export async function getUserDetails(params) {
  const userDetails = await UserModel.findOne(params).exec();
  return userDetails;
}

export async function deleteUser(params) {
  await UserModel.deleteOne(params).exec();
  return true;
}


export async function changePassword(filter, update) {
  await UserModel.findOneAndUpdate(filter, update).exec();
  return true;
}

export async function addTokenToBlacklist(params) {
  return new TokenModel(params);
}

// param is a json object with {"token": xxx}
export async function getToken(params) {
  const tokenDetails = await TokenModel.findOne(params).exec();
  return tokenDetails;
}
