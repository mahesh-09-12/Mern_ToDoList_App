import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  task: String,
  completed: { type: Boolean, default: false },
});

export const TodoModel = mongoose.model("todos", TodoSchema);
