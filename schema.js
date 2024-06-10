import mongoose from "mongoose";

const findSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
});

export const City = mongoose.model("City", findSchema);
