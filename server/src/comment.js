import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

// GET /comments
router.get("/", async (req, res) => {
  try {
    const comments = await prisma.comment.findMany();
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// POST /comments
router.post("/", async (req, res) => {
  const { content, authorId, postId } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        author: { connect: { id: authorId } },
        post: { connect: { id: postId } },
      },
    });

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// DELETE /comments/:id
router.delete("/:id/:userId", async (req, res) => {
    const { id, userId } = req.params;
  
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
      });
  
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
  
      if (comment.authorId !== String(userId)) {
        // Convert authorId to string before comparison
        return res.status(403).json({ error: "Unauthorized to delete this comment" });
      }
  
      const deletedComment = await prisma.comment.delete({
        where: { id },
      });
  
      res.json(deletedComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  });
  
  router.put("/:id/:userId", async (req, res) => {
  const { id, userId } = req.params;
  const { content } = req.body;

  try {
    // Fetch the existing comment
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    // If comment doesn't exist, return a 404 error
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // If the userId doesn't match the comment's authorId, return a 403 error
    if (comment.authorId !== String(userId)) {
      // Convert authorId to string before comparison
      return res.status(403).json({ error: "Unauthorized to update this comment" });
    }

    // If authorized, proceed with the update
    const updatedComment = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    res.json(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update comment" });
  }
});
  
  
export default router;



