import {
  ormCleanUpSessions as _cleanUpSessions,
  ormCreateSession as _createSession,
  ormGetSessionByUsername as _getSessionByUsername,
  ormUpdateUserStatus as _updateUserStatus,
  ormUpdateUserAttempt as _updateUserAttempt,
} from "../model/session-orm.js";

export async function createSession(req, res) {
  try {
    const {
      username1,
      username2,
      roomId,
      userStatus1,
      userStatus2,
      questionId,
      difficulty,
      attempt,
    } = req.body;

    const resp = await _createSession(
      username1,
      username2,
      roomId,
      userStatus1,
      userStatus2,
      questionId,
      difficulty,
      attempt
    );

    if (resp.err) {
      console.log(`Could not create a new session! ERROR: ${resp.err}`);
      return res
        .status(500)
        .json({ message: "Could not create a new session!" });
    }

    console.log(`Created new session ${roomId} successfully!`);
    return res.status(201).json({
      message: `Created new session ${roomId} successfully!`,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Database failure when creating new session!" });
  }
}

export async function getSessionDetails(req, res) {
  console.log("getting user info from session table");
  try {
    const { username } = req.params;
    if (username) {
      const resp = await _getSessionByUsername(username);

      if (resp.err) {
        console.log(
          `Could not get ${username}'s session details! ERROR: ${resp.err}`
        );
        return res
          .status(500)
          .json({ message: `Could not get ${username}'s session details!` });
      }

      console.log(`Get ${username}'s session successfully!`);
      return res.status(200).json(resp[0]);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Database failure when getting ${username}'s session details!`,
    });
  }
}

export async function updateUserStatus(req, res) {
  try {
    const { username } = req.params;
    if (username) {
      let resp = await _getSessionByUsername(username).catch(err => {
        console.log(err);
        return res.status(500).json({
          message: `Could not get ${username}'s session details!`,
        });
      });

      const doc = resp[0];
      let key;

      if (doc["username1"] === username) key = "userStatus1";
      if (doc["username2"] === username) key = "userStatus2";

      const update = { [key]: false };
      resp = await _updateUserStatus(username, update);

      if (resp.err) {
        console.log(
          `Could not update ${username}'s status! ERROR: ${resp.err}`
        );

        return res
          .status(500)
          .json({ message: `Could not update ${username}'s status!` });
      }

      // Clean up if both matched users exit the session
      await _cleanUpSessions()
        .then(resp =>
          console.log(`Deleted ${resp.deletedCount} completed session!`)
        )
        .catch(err => {
          console.log(`Could not clean up sessions! ERROR: ${err}`);
          return res
            .status(500)
            .json({ message: `Could not clean up sessions!` });
        });

      console.log(`Updated ${username}'s status successfully!`);
      return res.status(200).json({
        message: `Updated ${username}'s status successfully!`,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Database failure when updating user status!`,
    });
  }
}

export async function updateUserAttempt(req, res) {
  try {
    const { username } = req.params;
    const { code } = req.body;

    if (username) {
      const update = { attempt: code };
      const resp = await _updateUserAttempt(username, update);

      if (resp.err) {
        console.log(
          `Could not update ${username}'s attempt! ERROR: ${resp.err}`
        );

        return res
          .status(500)
          .json({ message: `Could not update ${username}'s attempt!` });
      }

      console.log(`Updated ${username}'s attempt successfully!`);
      console.log(`Update code is ${code}`);
      return res.status(200).json({
        message: `Updated ${username}'s attempt successfully!`,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Database failure when updating user status!`,
    });
  }
}
