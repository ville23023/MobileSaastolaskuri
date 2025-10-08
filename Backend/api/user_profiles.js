const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authenticate = require("../middleware/authUser");

//Account creation
router.post("/api/sign-up", async (req, res) => {
  try {
    const result = await User.create(req.body);
    res.status(201).json({ message: "Account created successfully" });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Username already exists" });
    } else {
      res.status(400).json({ error: "Something went wrong" });
    }
  }
});
//Login
router.post("/api/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Incorrect username or password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong");
  }
});
//List all users
router.get("/api/users", authenticate, async (req, res) => {
  try {
    const result = await User.find();
    res.status(200).json({
      status: "Success",
      results: result.length,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});
//Find user by its ID
router.get("/api/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});
//Update user
router.patch("/api/user-update/:id", async (req, res) => {
  const userToUpdate = req.params.id;
  const { userName, password } = req.body;
  try {
    const user = await User.findById(userToUpdate);
    if (!user) {
      res.status(204).json("User not found");
    }
    if(userName) user.userName = userName;
    if(password) user.password = password;
    await user.save();
    res.status(200).json("Update completed")
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});
//Delete user
router.delete("/api/user-delete/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.deleteOne({ _id: userId });
    res.status(200).json("User deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});
//Test account creation
router.post("/api/test_user_creation", async (req, res) => {
  try {
    const test_user = await User.create({
      userName: "testi-ukko",
      password: "password123",
    });
    res.status(201).json("Test user created");
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});

module.exports = router;
