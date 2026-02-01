// server/routes/boards.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
const prisma = new PrismaClient();

// 1. GET ALL BOARDS (for the logged-in user)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const boards = await prisma.board.findMany({
      where: { ownerId: req.user.id },
      include: { columns: true }, // Include columns so we can see structure later
    });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 2. CREATE A NEW BOARD
router.post("/", authMiddleware, async (req, res) => {
  const { title } = req.body;

  try {
    const board = await prisma.board.create({
      data: {
        title,
        ownerId: req.user.id,
        columns: {
          create: [
            { title: "To Do", order: 0 },
            { title: "In Progress", order: 1 },
            { title: "Done", order: 2 },
          ],
        },
      },
      include: { columns: true },
    });
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// 3. GET A SINGLE BOARD (with Columns & Tasks)
router.get("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const board = await prisma.board.findFirst({
      where: { id, ownerId: req.user.id },
      include: {
        columns: {
          include: { tasks: { orderBy: { order: 'asc' } } }, // Get tasks inside columns
          orderBy: { order: 'asc' }, // Order columns correctly
        },
      },
    });

    if (!board) return res.status(404).json({ error: "Board not found" });
    res.json(board);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// 4. DELETE A BOARD
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    // Use deleteMany to ensure we only delete if the board belongs to the USER
    // (Prisma's standard .delete() only checks ID, but .deleteMany() checks ID + Owner)
    const result = await prisma.board.deleteMany({
      where: {
        id: id,
        ownerId: req.user.id // SECURITY: Ensures user can only delete their own board
      }
    });

    // If count is 0, it means the board didn't exist OR the user doesn't own it
    if (result.count === 0) {
      return res.status(404).json({ error: "Board not found or unauthorized" });
    }

    res.json({ message: "Board deleted successfully" });
  } catch (err) {
    console.error(err); // Good for debugging in Render logs
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
