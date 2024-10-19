import mongoose from "mongoose";
var Schema = mongoose.Schema;

let SessionModelSchema = new Schema({
  username1: {
    type: String,
    required: true,
    unique: true,
  },
  username2: {
    type: String,
    required: true,
    unique: true,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  userStatus1: {
    type: Boolean,
    required: true,
    default: true,
  },
  userStatus2: {
    type: Boolean,
    required: true,
    default: true,
  },
  questionId: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true,
  },
  attempt: {
    type: String,
    default: "",
  },
});

export default mongoose.model("SessionModel", SessionModelSchema);
