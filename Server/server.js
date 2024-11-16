import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { TodoModel } from "./Models/Todo.js";

const port = 3000;

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/todoApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.get("/get", async (req, res) => {
  try {
    const data = await TodoModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/add", async (req, res) => {
  const { task } = req.body;
  try {
    const result = await TodoModel.create({ task });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to add task", error: err });
  }
});

app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const { task, completed } = req.body;
  try {
    const result = await TodoModel.findByIdAndUpdate(
      id,
      { task, completed },
      { new: true }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task", error: err });
  }
});

app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await TodoModel.findByIdAndDelete(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err });
  }
});

app.listen(port, () => {
  console.log("Server is running...");
});
