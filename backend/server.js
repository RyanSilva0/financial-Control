import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/User.js";
import connectDB from "./db.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("WalletFy API funcionando!");
});

connectDB();

app.use("/User", userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
