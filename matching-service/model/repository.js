import { DataTypes, Sequelize } from "sequelize";

const sequelize = new Sequelize("sqlite::memory:");

const PendingMatch = sequelize.define("PendingMatch", {
  user: DataTypes.STRING,
  clientId: DataTypes.STRING,
  difficulty: DataTypes.NUMBER,
  questionId: DataTypes.NUMBER,
  description: DataTypes.STRING,
  title: DataTypes.STRING
});

await sequelize.sync({ force: true });

export async function createPendingMatch(params) {
  return await PendingMatch.create(params);
}

export async function findPendingMatch(condition) {
  console.log("Finding a match!");
  return await PendingMatch.findOne(condition);
}

export async function deletePendingMatch(pendingMatch) {
  if (!pendingMatch) return;
  console.log("Destroy PendingMatch: ", pendingMatch);
  await pendingMatch.destroy();
  console.log("Pending match removed from database!");
}
