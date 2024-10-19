import {
  ormGetHistory as _getHistory,
  ormGetUserHistory as _getUserHistory,
  ormCreateHistory as _createHistory,
} from "../model/history-orm.js";

export async function getHistory(req, res) {
  let resp;
  try {
    const { username, roomId } = req.params;
    if (!roomId) {
      console.log("No roomId specified. Retrieving all history");
      console.log(`username: ${username}`);
      resp = await _getUserHistory(username);
      if (resp.err) {
        console.log(`Could not retrieve history`);
        return res.status(500).json({ message: `Could not retrieve history` });
      }

      console.log(`Retrieved all history successfully!`);
      return res.status(200).json({
        message: `Retrieved all history successfully!`,
        body: resp,
      });
    }

    resp = await _getHistory(username, roomId);
    if (resp.err) {
      console.log(
        `Could not retrieve history with username: ${username} and roomId: ${roomId}`
      );
      return res.status(500).json({
        message: `Could not retrieve history with username: ${username} and roomId: ${roomId}`,
      });
    }

    console.log(
      `Retrieved history with username: ${username} and roomId: ${roomId} successfully!`
    );
    return res.status(200).json({
      message: `Retrieved history with username: ${username} and roomId: ${roomId} successfully!`,
      body: resp[0],
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Database failure when retrieving history!" });
  }
}

export async function createHistory(req, res) {
  try {
    const {
      username,
      roomId,
      matchname,
      difficulty,
      questionId,
      dateTime,
      attempt,
    } = req.body;
    if (
      !username ||
      !roomId ||
      !matchname ||
      !difficulty ||
      !questionId ||
      !dateTime ||
      !attempt
    ) {
      console.log(`Missing parameters from request body!`);
      return res
        .status(400)
        .json({ message: "Missing parameters from request body!" });
    }

    const resp = await _createHistory(
      username,
      roomId,
      matchname,
      difficulty,
      questionId,
      dateTime,
      attempt
    );
    if (resp.err) {
      console.log(`Could not create a new history! ERROR: ${resp.err}`);
      return res
        .status(500)
        .json({ message: "Could not create a new history!" });
    }

    console.log(`Created new history successfully!`);
    return res.status(200).json({
      message: `Created new history successfully!`,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Database failure when creating new history!" });
  }
}
