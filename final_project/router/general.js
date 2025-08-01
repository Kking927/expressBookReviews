const express = require("express");
const fs = require("fs");
const router = express.Router();

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  let users = [];
  if (fs.existsSync("users.json")) {
    const data = fs.readFileSync("users.json", "utf8");
    users = JSON.parse(data);
  }

  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "User already exists!" });
  }

  users.push({ username, password });

  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
  return res.status(201).json({ message: "Customer successfully registered. Now you can login" });
});

module.exports = router;
