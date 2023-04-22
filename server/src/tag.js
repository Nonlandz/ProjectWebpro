import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: error });
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
    res.status(500).json({ error: error });
  }
});

export default router;
