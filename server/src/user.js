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

    const checkPassword = await bcypt.compare(password, checkEmail.password);

    console.log(checkPassword);

    if (!checkPassword) {
      throw new Error("password is not match");
    }

    delete checkEmail.password;

    const accessToken = jwt.sign(checkEmail, process.env.TOKEN, {
      expiresIn: "2h",
    });

    res.json({ accessToken: accessToken, user: checkEmail });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;