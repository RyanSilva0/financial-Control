import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/User.js";
import connectDB from "./db.js";
dotnet.config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

connectDB();
app.use("/users", userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:3000");
});
