const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "../../", "utils", "user.json");

function readUsersFromFile() {
  try {
    const usersData = fs.readFileSync(usersFilePath, "utf8");
    return JSON.parse(usersData);
  } catch (error) {
    console.error("Error reading users from file:", error);
    return [];
  }
}

function writeUsersToFile(tasks) {
  try {
    const usersData = JSON.stringify(tasks, null, 2);
    fs.writeFileSync(usersFilePath, usersData, "utf8");
  } catch (error) {
    console.error("Error writing users to file:", error);
  }
}

module.exports = {
  readUsersFromFile,
  writeUsersToFile,
};
