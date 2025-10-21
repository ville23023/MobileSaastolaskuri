const express = require("express");
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
require('dotenv').config();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// API endpointit
app.use("/api", require("./api/user_profiles"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const start = async () =>{
  try{
    await connectDB();
    app.listen(PORT, () =>{
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server due to DB connection error:", error);
    process.exit(1);
  }
};

start();
