const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { authenticate, admin } = require("../middleware/authUser");
const SavingGoal = require("../models/savingGoal");

//Account creation
router.post("/api/sign-up", async (req, res) => {
  try {
    const {userName, email, password} = req.body;
    const result = await User.create({
      userName, 
      email, 
      password,
    });
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
    const token = jwt.sign({ userId: user._id, role: user.role}, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong");
  }
});
//List all users
router.get("/api/users", authenticate, admin, async (req, res) => {
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
router.get("/api/user/:id", authenticate, admin, async (req, res) => {
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
  const { userName, email, password } = req.body;
  try {
    const user = await User.findById(userToUpdate);
    if (!user) {
      res.status(204).json("User not found");
    }
    if(userName) user.userName = userName;
    if(email) user.email = email;
    if(password) user.password = password;
    
    await user.save();
    res.status(200).json("Update completed")
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});
//Delete user
router.delete("/api/user-delete/:id", authenticate, admin, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.deleteOne({ _id: userId });
    res.status(200).json("User deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});
// Create primary admin, for one-time use only
// router.post('/api/create-admin', async (req, res) => {
//   try {
//     const { secretKey } = req.body;
//     const existingUser = await User.findOne({ userName: process.env.ADMIN_USERNAME});
//     if (existingUser) {
//       return res.status(400).json({ error: "Username already exists"});
//     }
//     if (secretKey !== process.env.ADMIN_CREATION_SECRET) {
//       return res.status(403).json({ error:"Invalid secret key"});
//     }
//       const admin = await User.create({
//         userName: process.env.ADMIN_USERNAME,
//         email: process.env.ADMIN_EMAIL,
//         password: process.env.ADMIN_PASSWORD,
//         role: 'admin'
//     });
//     res.status(201).json({ message:"Admin user created successfully"});
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ error:"Something went wrong"});
//   }
// });
//Test account creation
router.post("/api/test_user_creation", async (req, res) => {
  try {
    const test_user = await User.create({
      userName: "testi-ukko",
      email: "testi@luukku.com",
      password: "password123",
    });
    res.status(201).json("Test user created");
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});
//Saving goal creation
router.post("/api/create_saving_goal", authenticate, async (req, res)=>{
  try{
    const { goalName, targetAmount, startDate, endDate } = req.body;
    const NewSavingGoal = new SavingGoal({
      ...req.body,
      user: req.user.userId});
    const savedGoal = await NewSavingGoal.save()
    res.status(201).json({ message: "Goal created successfully" })
  }catch (error){
    console.log(error);
    res.status(400).send("Something went wrong");
  }
});
//Saving Goal details
router.get("/api/saving_goal_details/:id", authenticate, async(req, res)=>{
  const goalId = req.params.id;
  try{
    const goal = await SavingGoal.findOne({ _id: goalId, user:req.user.userId });
    res.status(200).json(goal);
  }catch (error){
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});
//Lists all Saving goals
router.get("/api/all_saving_goals", authenticate, async(req, res) =>{
  try{
    const result = await SavingGoal.find({ user: req.user.userId });
    res.status(200).json(result);
  }catch (error){
    console.log(error);
    res.status(400).json("Something went wrong");
  }
})

module.exports = router;
