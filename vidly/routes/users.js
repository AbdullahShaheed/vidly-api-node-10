const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/api/users/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/api/users", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();

    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send({
      name: user.name,
      email: user.email,
    });
  } catch (ex) {
    res.status(500).send("Something failed.");
    console.log(ex.message);
  }
});

module.exports = router;
