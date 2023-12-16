const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

/** imports  */
const {
  readUsersFromFile,
  writeUsersToFile,
} = require("./utils/helper/fs.helper");

const PORT = process.env.PORT || 3001;
const app = express();

/**
 * middleware
 */
app.use(express.json());

/** routes or endpoints */

/**
 * request: get
 * URL: /users
 * params: {}
 */
app.get("/users", (req, res) => {
  let users = readUsersFromFile();
  res.status(201).json({ message: "User Data Fetched", data: users });
});

/**
 * request: post
 * URL: /users
 * params: { username, password }
 */
app.post("/users", (req, res) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = bcrypt.hashSync(
      password,
      parseInt(process.env.SALT_ROUND)
    );

    let users = readUsersFromFile();

    const user = {
      id: users.length + 1,
      username: username,
      password: hashedPassword,
    };

    users.push(user);

    writeUsersToFile(users);
    return res.status(201).json({ message: "das ka ho gya", data: user });
  } catch (error) {
    throw error;
  }
});

/**
 * request: POST
 * URL: /users/login
 * params: { username, password }
 */
app.post("/users/login", (req, res) => {
  const { username, password } = req.body;
  const users = readUsersFromFile();

  const user = users.find((u) => u.username === username);
  if (!user) {
    res.status(401).json({ status: false, message: "Email doesn't exists" });
  }

  const passwordCompare = bcrypt.compareSync(password, user.password);
  if (!passwordCompare) {
    res.status(401).json({ status: false, message: "Password doesn't match" });
  }

  return res.status(200).json({ message: "Login successful", data: user });
});

/**
 * request: PATCH
 * /users/update/:username
 */
app.patch("/users/update/:username", (req, res) => {
  const { username } = req.params;
  const { new_username } = req.body;

  let users = readUsersFromFile();
  

  const existingUser = users.find((user) => user.username === username);
  if (!existingUser) {
    return res.status(404).json({ status: false, message: "User not found" });
  }

  existingUser.username = new_username;
  writeUsersToFile(users);

  return res.status(200).json({
    status: true,
    message: "Username updated successfully",
    data: existingUser,
  });
});




app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
