const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

const users = [];

app.get("/users", (req, res) => {
  res.json(users);
});

app.post("/users/register", async (req, res) => {
  const { name, password } = req.body;
  // const user = { username: name , password: password}
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = { username: name, password: hashedPassword };
    console.log(salt);
    console.log(hashedPassword);
    users.push(user);
    res.status(201).send();
  } catch (err) {
    res.status(500).send();
  }
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => user.username === req.body.name);
  if (user == null) {
    return res.status(400).send("Invalid user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Successfully logged");
    } else {
      res.send("Not Allowed");
    }
  } catch (err) {
    res.status(403).send(err);
  }
});

app.listen(5001, () => {
  console.log("Server started at port 5001");
});
