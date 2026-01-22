// server/routes/tasks.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const prisma = new PrismaClient();

// 1. CREATE A NEW TASK
router.post("/", authMiddleware, async (req, res) => {
  const { content, columnId, boardId } = req.body;

  try {
    // Find the current highest order in the column to append the new task at the bottom
    const lastTask = await prisma.task.findFirst({
      where: { columnId },
      orderBy: { order: 'desc' },
    });

    const newOrder = lastTask ? lastTask.order + 1 : 0;

    const task = await prisma.task.create({
      data: {
        content,
        columnId,
        order: newOrder,
      },
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 2. MOVE TASK (Update Column & Order)
router.put("/:id/move", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { columnId, order } = req.body;

  try {
    const task = await prisma.task.update({
      where: { id },
      data: { columnId, order },
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// 3. UPDATE TASK DETAILS (Description, Priority, Due Date)
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { content, description, priority, dueDate } = req.body;

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        content,
        description,
        priority, // "LOW", "MEDIUM", "HIGH"
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// 4. DELETE TASK
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});
module.exports = router;