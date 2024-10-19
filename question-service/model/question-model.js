import mongoose from "mongoose";
var Schema = mongoose.Schema;

let QuestionModelSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  level: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

export default mongoose.model("QuestionModel", QuestionModelSchema);
