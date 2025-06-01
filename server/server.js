const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URI)

const messageRoutes = require("./routes/messageRoutes");

const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));

