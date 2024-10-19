import { getHistory, getUserHistory, createHistory } from "./repository.js";

export async function ormGetHistory(username, roomId) {
  try {
    const history = await getHistory({ username, roomId });
    return history;
  } catch (err) {
    console.log("ERROR: Could not retrieve history");
    return { err };
  }
}

export async function ormCreateHistory(
  username,
  roomId,
  matchname,
  difficulty,
  questionId,
  dateTime,
  attempt
) {
  try {
    return await createHistory({
      username,
      roomId,
      matchname,
      difficulty,
      questionId,
      dateTime,
      attempt,
    });
  } catch (err) {
    console.log("ERROR: Could not create new match");
    return { err };
  }
}

export async function ormGetUserHistory(username) {
  try {
    const history = await getUserHistory(username);
    return history;
  } catch (err) {
    console.log("ERROR: Could not retrieve history");
    return { err };
  }
}
