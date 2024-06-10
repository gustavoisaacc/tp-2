import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { City } from "./schema.js";

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
connectDB();

app.post("/city", async (req, res) => {
  const data = req.body;
  const newCity = new City(data);
  newCity.save();
  res.json({ msg: "ok" });
});

app.get("/city", async (req, res) => {
  const cities = await City.find();
  res.json(cities);
});

app.listen(3000, () => {
  console.log("server on port 3000");
});
