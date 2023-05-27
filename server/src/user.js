import express from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const router = express.Router();
import bcypt from "bcryptjs"; //hashรหัส
import jwt from "jsonwebtoken";  //token
import { object, string, number, date } from "yup";


const findEmail = async (email) => {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      UserInfo: true,
    },
  });
};

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    // validating ใช้yup
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

    const createUser = await prisma.user.create({    //สร้างuser
      data: {
        email: email,
        password: hash,
      },
    });

    await prisma.userInfo.create({      //สร้าง userinfo
      data: {
        userId: createUser.id,
      },
    });

    delete createUser.password;

    const accessToken = jwt.sign(createUser, process.env.TOKEN, {
      expiresIn: "2h", //สร้างtoken
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

//get post
router.get("/posts/:id", async (req, res) => {
  try {
    const posts = await prisma.user.findMany({
      where: {
        id: req.params.id,
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

//ลบโพส
router.delete("/posts/:postId", async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    
    // Check if the post exists
    const existingPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    
    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    
    // Delete the post
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});





//get fav
router.get("/fav/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const post = await prisma.postFav.findMany({
      where: {
        userId: req.params.id,
      },
      include: {
        Post: {
          include: {
            Tag: true,
            UserFav: true,
            Comment: true,
            User: {
              select: {
                UserInfo: true,
              },
            },
          },
        },
      },
    });
    res.json(post);
  } catch (error) {
    console.log(error);
  }
});


//update userinfo
router.put("/userinfo", async (req, res) => {
  try {
    const { userId, username, firstName, lastName, phone, address } = req.body;

    let userInfoSchema = object({
      userId: string().required(),
      username: string().required(),
      firstName: string(),
      lastName: string(),
      phone: string(),   //use yup validate
      address: string(),
    });

    await userInfoSchema.validate(req.body);

    const updateUserInfo = await prisma.userInfo.update({
      where: {
        userId: userId,
      },
      data: {
        username: username,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address,
        updatedAt: new Date(),
      },
    });

    res.json(updateUserInfo);
  } catch (error) {
    if (error.code === "P2002") {    //check เบอร์ กับ username
      let field = error.meta.target.includes("phone") ? "phone" : "username";
      res.status(409).json({ message: `${field} already exists` }); // Sending the error to frontend
    } else {
      // Handle other types of errors
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  }
});

//ลืมรหัสผ่าน
router.post("/forgotpassword", async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Validate email and new password
    let schema = object({
      email: string().email().required(),
      password: string().required().min(6),
      confirmPassword: string().required().oneOf([password], "Passwords must match"),
    });

    await schema.validate(req.body);

    // Check if the email exists in the database
    const existingUser = await findEmail(email);

    if (!existingUser) {
      res.status(400).json({ message: "User with this email does not exist" });
      return;
    }

    // Update the user's password
    const hash = await bcypt.hash(password, 10);

    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: hash,
      },
    });

    res.json({ message: "Password has been successfully reset" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



router.get("/profile/:userId", async (req, res) => { //ดึงuser profile
  
  try {
    
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        UserInfo: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});




export default router;
