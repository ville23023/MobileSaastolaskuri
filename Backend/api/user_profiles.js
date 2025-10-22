const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { authenticate, admin } = require("../middleware/authUser");
const SavingGoal = require("../models/savingGoal");
const SavedAmount = require("../models/savedAmount");

// -------------------------
// AUTH
// -------------------------

// Account creation
router.post("/sign-up", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    await User.create({ userName, email, password });
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

// Login
router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Incorrect username or password" });
    }

    // fallback user cannot login with missing role
    if (!user.role) {
      user.role = "user";
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.log(err);
    res.status(400).send("Something went wrong");
  }
});

// -------------------------
// USER PROFILE (SELF)
// -------------------------

// GET own profile
router.get("/user/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Something went wrong" });
  }
});

// UPDATE own profile
router.patch("/user/me", authenticate, async (req, res) => {
  try {
    const { userName, email } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (userName) user.userName = userName;
    if (email) user.email = email;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Something went wrong" });
  }
});

// -------------------------
// ADMIN USER ROUTES
// -------------------------

// List all users (ADMIN)
router.get("/users", authenticate, admin, async (req, res) => {
  try {
    const result = await User.find().select("-password");
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

// Get user by ID (ADMIN)
router.get("/users/:id", authenticate, admin, async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});

// Update user by ID (ADMIN)
router.patch("/users/:id", authenticate, admin, async (req, res) => {
  const userId = req.params.id;
  const { userName, email, password } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json("User not found");
    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (password) user.password = password;
    await user.save();
    res.status(200).json("User updated successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});

// Delete user (ADMIN)
router.delete("/users/:id", authenticate, admin, async (req, res) => {
  const userId = req.params.id;
  try {
    const deleteUser = await User.findById(userId);
    if (deleteUser.role === "admin") {
      return res.status(403).json({ error: "Cannot delete admin user" });
    }
    await SavedAmount.deleteMany({ user: userId });
    await SavingGoal.deleteMany({ user: userId });
    await User.deleteOne({ _id: userId });
    res.status(200).json("User deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});

// -------------------------
// SAVING GOALS
// -------------------------

router.post("/create_saving_goal", authenticate, async (req, res) => {
  try {
    const NewSavingGoal = new SavingGoal({
      ...req.body,
      user: req.user.userId,
    });
    await NewSavingGoal.save();
    res.status(201).json({ message: "Goal created successfully" });
  } catch (error) {
    console.log(error);
    res.status(400).send("Something went wrong");
  }
});

router.get("/saving_plan_details/:id", authenticate, async (req, res) => {
  const goalId = req.params.id;
  try {
    const goal = await SavingGoal.findOne({ _id: goalId, user: req.user.userId });
    res.status(200).json(goal);
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});

router.get("/all_saving_plans", authenticate, async (req, res) => {
  try {
    const result = await SavingGoal
      .find({ user: req.user.userId })
      .populate({ path: "user", select: ["userName"] });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});

router.delete("/delete_saving_plan/:id", authenticate, async (req, res) => {
  const savingPlan = req.params.id;
  try {
    await SavingGoal.deleteOne({ _id: savingPlan, user: req.user.userId });
    res.status(200).json("Plan deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});

router.patch("/edit_saving_plan/:id", authenticate, async (req, res) => {
  const planToUpdate = req.params.id;
  const { goalName, targetAmount, startDate, endDate } = req.body;
  try {
    const plan = await SavingGoal.findOne({ _id: planToUpdate, user: req.user.userId });
    if (!plan) return res.status(204).json("Plan not found");
    if (goalName) plan.goalName = goalName;
    if (targetAmount) plan.targetAmount = targetAmount;
    if (startDate) plan.startDate = startDate;
    if (endDate) plan.endDate = endDate;
    await plan.save();
    res.status(200).json("Goal edited successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});

// -------------------------
// SAVED AMOUNTS
// -------------------------

router.post("/create_saved_amount", authenticate, async (req, res) => {
  try {
    const NewSavedAmount = new SavedAmount({
      ...req.body,
      user: req.user.userId,
    });
    await NewSavedAmount.save();
    res.status(201).json({ message: "Saved amount added" });
  } catch (error) {
    console.log(error);
    res.status(400).send("Something went wrong");
  }
});

router.get("/saved_amount/:id", authenticate, async (req, res) => {
  const savedAmountId = req.params.id;
  try {
    const amount = await SavedAmount.findOne({ _id: savedAmountId, user: req.user.userId });
    res.status(200).json(amount);
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});

router.get("/all_saved_amounts", authenticate, async (req, res) => {
  try {
    const result = await SavedAmount
      .find({ user: req.user.userId })
      .populate({ path: "user", select: ["userName"] });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});

router.delete("/delete_saved_amount/:id", authenticate, async (req, res) => {
  const savedAmount = req.params.id;
  try {
    await SavedAmount.deleteOne({ _id: savedAmount, user: req.user.userId });
    res.status(200).json("Amount deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});

router.patch("/update_saved_amount/:id", authenticate, async (req, res) => {
  const updateAmount = req.params.id;
  const { savedAmount, date } = req.body;
  try {
    const amount = await SavedAmount.findOne({ _id: updateAmount, user: req.user.userId });
    if (!amount) return res.status(204).json("Amount not found");
    if (savedAmount) amount.savedAmount = savedAmount;
    if (date) amount.date = date;
    await amount.save();
    res.status(200).json({ message: "Amount edited successfully", savedAmount: amount.savedAmount });
  } catch (error) {
    console.log(error);
    res.status(400).json("Something went wrong");
  }
});
// Create primary admin, for one-time use only
router.post('/api/create-admin', async (req, res) => {
  try {
    const { userName, email, password, secretKey } = req.body;
    const existingUser = await User.findOne({userName});
    if (existingUser) {
      return res.status(400).json({error: "Username already exists"});
    }
    if (secretKey !== process.env.ADMIN_CREATION_SECRET) {
      return res.status(403).json({error:"Invalid secret key"});
    }
      const admin = await User.create({
        userName,
        email,
        password,
        role: 'admin'
    });
    res.status(201).json({message:"Admin user created successfully"});
  } catch (error) {
    console.log(error);
    res.status(400).json({error:"Something went wrong"});
  }
});

module.exports = router;
