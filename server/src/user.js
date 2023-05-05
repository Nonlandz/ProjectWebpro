import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();
import bcypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { object, string, number, date } from "yup";

const findEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
};

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validating
    let userSchema = object({
      email: string().email().required(),
      password: string().required(),
    });

    await userSchema.validate(req.body);

    // check email in database
    const checkEmail = await findEmail(email);

    if (checkEmail) {
      throw new Error("this email already exits");
    }

    const hash = await bcypt.hash(password, 10);

    const createUser = await prisma.user.create({
      data: {
        email: email,
        password: hash,
      },
    });

    await prisma.userInfo.create({
      data: {
        userId: createUser.id,
      },
    });

    delete createUser.password;

    const accessToken = jwt.sign(createUser, process.env.TOKEN, {
      expiresIn: "2h",
    });

    res.json({ accessToken: accessToken, user: createUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validating
    let userSchema = object({
      email: string().email().required(),
      password: string().required(),
    });

    await userSchema.validate(req.body);

    const checkEmail = await findEmail(email);

    if (!checkEmail) {
      throw new Error("this email not have in database");
    }

    // Include the userInfo in the response
    const userInfo = await prisma.userInfo.findUnique({
      where: {
        userId: checkEmail.id,
      },
    });

    const checkPassword = await bcypt.compare(password, checkEmail.password);

    if (!checkPassword) {
      throw new Error("password is not match");
    }

    // Combine the user and userInfo objects
    const userWithInfo = {
      ...checkEmail,
      ...userInfo,
    };

    delete userWithInfo.password;

    const accessToken = jwt.sign(userWithInfo, process.env.TOKEN, {
      expiresIn: "2h",
    });

    res.json({ accessToken: accessToken, user: userWithInfo });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//get post
router.get("/posts/:id", async (req, res) => {
  try {
    const posts = await prisma.user.findMany({
      where: {
        id: req.query.id,
      },
      include: {
        Post: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
