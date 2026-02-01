const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= CREATE TASK ================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    let { title, priority, category, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    // ✅ NORMALIZE INPUT (THIS FIXES YOUR BUG)
    priority = priority ? priority.toLowerCase() : "medium";
    category = category ? category.trim() : "General";

    const task = await Task.create({
      user: req.user,
      title: title.trim(),
      priority,
      category,
      dueDate: dueDate || null,
      completed: false,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ================= GET TASKS ================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= UPDATE TASK ================= */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.body.priority) {
      req.body.priority = req.body.priority.toLowerCase();
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ================= DELETE TASK ================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
