import {
  ormGetQuestionsByDifficulty as _getQuestionsByDifficulty,
  ormGetAllQuestions as _getAllQuestions,
  ormGetQuestionById as _getQuestionById,
} from "../model/question-orm.js";

export async function getQuestionsByDifficulty(req, res) {
  let resp;
  try {
    const { level } = req.params;
    if (!level) {
      console.log("No difficulty level specified. Retrieving all questions...");
      resp = await _getAllQuestions();
      if (resp.err) {
        console.log(`Could not retrieve questions`);
        return res
          .status(500)
          .json({ message: `Could not retrieve questions` });
      }

      console.log(`Retrieved all questions successfully!`);
      return res.status(200).json({
        message: `Retrieved all questions successfully!`,
        body: resp,
      });
    }

    resp = await _getQuestionsByDifficulty(level);
    if (resp.err) {
      console.log(
        `Could not retrieve questions with difficulty level: ${level}`
      );
      return res.status(500).json({
        message: `Could not retrieve questions with difficulty level: ${level}`,
      });
    }

    console.log(
      `Retrieved a question with difficulty level: ${level} successfully!`
    );
    const idx = Math.floor(Math.random() * 3);
    return res.status(200).json({
      message: `Retrieved a question with difficulty level: ${level} successfully!`,
      body: resp[idx],
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Database failure when retrieving questions!" });
  }
}

export async function getQuestionById(req, res) {
  console.log("getting question by id");
  let resp;
  try {
    const { id } = req.params;
    // TODO: stronger guard for invalid IDs
    if (!id) {
      console.log(`Invalid question ID.`);
      return res.status(500).json({ message: `Invalid question ID` });
    }

    resp = await _getQuestionById(id);
    if (resp.err) {
      console.log(`Could not retrieve question with ID: ${id}`);
      return res.status(500).json({
        message: `Could not retrieve question with ID: ${id}`,
      });
    }

    console.log(`Retrieved question with ID: ${id} successfully!`);
    return res.status(200).json({
      message: `Retrieved question with ID: ${id} successfully!`,
      body: resp[0],
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Database failure when retrieving question!" });
  }
}
