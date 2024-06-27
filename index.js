require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const sendEmailRoute = require("./routes/sendEmailRoute");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

// Testing endpoint
app.get("/", (req, res) => {
  return res.send("working");
});

// MongoDB Connection
mongoose.set("strictQuery", false);
const Connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database is connected");
  } catch (error) {
    console.log("Database connection error:", error);
    process.exit(1);
  }
};

// Routes
app.use("/api/users", userRoute);
app.use("/api/emails", sendEmailRoute);

// Start Server
app.listen(PORT, () => {
  Connect();
  console.log(`Server running on port ${PORT}`);
});
