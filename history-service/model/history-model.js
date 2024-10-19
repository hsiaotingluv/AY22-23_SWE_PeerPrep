import mongoose from "mongoose";
var Schema = mongoose.Schema;

let HistoryModelSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  matchname: {
    type: String,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true,
  },
  questionId: {
    type: Number,
    required: true,
  },
  dateTime: {
    type: String,
    required: true,
  },
  attempt: {
    type: String,
    required: true,
  },
});

export default mongoose.model("HistoryModel", HistoryModelSchema);
