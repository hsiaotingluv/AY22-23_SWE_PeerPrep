import {
  cleanUpSessions,
  createSession,
  getSessionByUsername,
  updateSession,
} from "./repository.js";

export async function ormCreateSession(
  username1,
  username2,
  roomId,
  userStatus1,
  userStatus2,
  questionId,
  difficulty,
  attempt
) {
  try {
    const newSession = await createSession({
      username1,
      username2,
      roomId,
      userStatus1,
      userStatus2,
      questionId,
      difficulty,
      attempt,
    });
    await newSession.save();
    return true;
  } catch (err) {
    console.log("ERROR: Could not create new session");
    return { err };
  }
}

export async function ormGetSessionByUsername(username) {
  try {
    return await getSessionByUsername({
      $or: [{ username1: username }, { username2: username }],
    });
  } catch (err) {
    console.log(`ERROR: Could not get ${username}'s session!`);
    return { err };
  }
}

export async function ormUpdateUserStatus(username, update) {
  try {
    const filter = { $or: [{ username1: username }, { username2: username }] };
    return await updateSession(filter, update);
  } catch (err) {
    console.log(`ERROR: Could not get ${username}'s session!`);
    return { err };
  }
}

export async function ormUpdateUserAttempt(username, update) {
  try {
    const filter = { $or: [{ username1: username }, { username2: username }] };
    return await updateSession(filter, update);
  } catch (err) {
    console.log(`ERROR: Could not get ${username}'s session!`);
    return { err };
  }
}

export async function ormCleanUpSessions() {
  try {
    return await cleanUpSessions();
  } catch (err) {
    console.log(`ERROR: Could not get remove session!`);
    return { err };
  }
}
