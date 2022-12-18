const express = require("express");

// .Router() function is used to create a new router object
const router = express.Router();

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, isSeller } = req.body;

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(403).json({ err: "User already exists" });
    }

    if (!validateName(name)) {
      return res.status(400).json({ err: "Invalid name" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ err: "Invalid" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ err: "Invalid" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = { email, name, password: hashedPassword, isSeller };

    const createdUser = await User.create(user);

    return res.status(200).json({
      message: `Welcome ${createdUser.name},Your account is successfully created`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.length === 0) {
      return res.status(403).json({ err: "Please enter a valid email" });
    }
    if (password.length === 0) {
      return res.status(403).json({ err: "Please enter a valid password" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(403).json({ err: "User not found" });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordMatched) {
      return res.status(403).json({ err: "email or password mismatch" });
    }

    const payload = { user: { id: existingUser.id } };
    const bearerToken = await jwt.sign(payload, "SECRET MESSAGE", {
      expiresIn: 36000,
    });

    res.cookie("t", bearerToken, { expire: new Date() + 9999 });

    return res.status(200).json({ bearerToken: bearerToken });
  } catch (error) {
    console.log(">>>>>", error);
    return res.status(500).send(error);
  }
});

module.exports = router;
