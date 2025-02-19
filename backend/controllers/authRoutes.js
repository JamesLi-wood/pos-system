const jwt = require("jsonwebtoken");
const { validateUser } = require("../utils/mongo");

const signup = async (req, res) => {
  console.log("AT SIGNUP PATH");
  res.status(200).send("AT SIGNUP PATH");
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await validateUser(username, password);

  if (!user) {
    console.log("invalid credentials");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.status(200).send({ token });
};

module.exports = { signup, login };
