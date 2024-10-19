import {
  getQuestionsByDifficulty,
  getQuestionById,
  getAllQuestions,
} from "./repository.js";

export async function ormGetQuestionsByDifficulty(level) {
  try {
    const question = await getQuestionsByDifficulty({ level });
    return question;
  } catch (err) {
    console.log("ERROR: Could not retrieve question by difficulty");
    return { err };
  }
}

export async function ormGetQuestionById(id) {
  try {
    return await getQuestionById({ id });
  } catch (err) {
    console.log("ERROR: Could not retrieve question by ID");
    return { err };
  }
}

export async function ormGetAllQuestions() {
  try {
    const questions = await getAllQuestions();
    return questions;
  } catch (err) {
    console.log("ERROR: Could not retrieve questions");
    return { err };
  }
}
