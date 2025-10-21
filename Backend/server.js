const express = require("express");
const connectDB = require("./config/db");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
require('dotenv').config();

//connectDB();

app.use(cors());
app.use(express.json());

//API endpointit
app.use("", require("./api/user_profiles"));

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
    console.error("Failed tot start server due to DB connection error:", error);
    process.exit(1);
  }
};

start();
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
