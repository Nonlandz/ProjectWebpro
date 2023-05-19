import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const tag = await prisma.tag.create({
      data: {
        name: req.body.name,
      },
    });
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await prisma.tag.delete({
      where: { id: parseInt(id) },
    });
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
