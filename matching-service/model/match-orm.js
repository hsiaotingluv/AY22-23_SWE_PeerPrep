import {
  createPendingMatch,
  deletePendingMatch,
  findPendingMatch,
} from "./repository.js";

export async function ormCreatePendingMatch(
  user,
  clientId,
  difficulty,
  questionId,
  description,
  title
) {
  try {
    return await createPendingMatch({
      user,
      clientId,
      difficulty,
      questionId,
      description,
      title
    });
  } catch (err) {
    console.log("ERROR: Could not create new match");
    return { err };
  }
}

export async function ormFindPendingMatch(difficulty) {
  try {
    const pendingMatch = await findPendingMatch({
      where: { difficulty: difficulty },
    });
    return pendingMatch;
  } catch (err) {
    console.log("ERROR: Could not find pending match");
    console.log(err);
    return null;
  }
}

export async function ormDeletePendingMatch(pendingMatch) {
  try {
    await deletePendingMatch(pendingMatch);
    return true;
  } catch (err) {
    console.log("ERROR: Could not delete new match");
    return { err };
  }
}
