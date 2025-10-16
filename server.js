import mongoose from "mongoose";
import express from "express";
import { userModel } from "./schema/user-schema.js";
import { compare, hash } from "bcrypt";
import { postModel } from "./schema/post-schema.js";
import cors from "cors";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware/authMiddleware.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = 5555;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

const connectToDB = async () => {
  await mongoose.connect(
    "mongodb+srv://25hp0700_db_user:pass123@enkhsaihan.aqas0pa.mongodb.net/"
  );
};
connectToDB();

app.post("/user", async (req, res) => {
  const body = req.body;
  const { username, password, email } = body;

  const isExisting = await userModel.findOne({ email });

  if (isExisting) {
    res
      .status(400)
      .json({ message: "user already exist please use another email " });
  } else {
    const saltRound = 10;

    const hashedPassword = await hash(password, saltRound);

    const createdUser = await userModel.create({
      email: email,
      password: hashedPassword,
      username: username,
    });
    const accessToken = jwt.sign(
      {
        data: createdUser,
      },
      JWT_SECRET,
      { expiresIn: "6h" }
    );
    res.json(accessToken);
  }
});

app.post("/post", authMiddleware, async (req, res) => {
  const body = req.body;
  const user = req.user;
  const { images, caption } = body;
  const createPost = await postModel.create({
    caption: caption,
    images: images,
    user: user._id,
  });
  res.status(200).json(createPost);
});

app.post("/login", async (req, res) => {
  const body = req.body;
  const { email, password } = body;
  const user = await userModel.findOne({ email });
  if (user) {
    const hashedPassword = user.password;
    const isValid = await compare(password, hashedPassword);
    if (isValid) {
      const accessToken = jwt.sign(
        {
          data: user,
        },
        JWT_SECRET,
        { expiresIn: "6h" }
      );
      res.json(accessToken);
    } else {
      res.status(404).json({ message: "password is wrong" });
    }
  } else {
    res.status(404).json({ message: " you should regigster" });
  }
});
app.get("/allPost", async (req, res) => {
  const find = await postModel.find({}).populate("user");
  res.status(200).json(find);

  console.log(find);
});
app.post("/postLike/:postId", authMiddleware, async (req, res) => {
  const user = req.user;

  const params = req.params;

  const postId = params.postId;
  const post = await postModel.findById(postId);

  const postLikes = post.like;

  const isLiked = postLikes.includes(postId);

  if (isLiked) {
    await postModel.findByIdAndUpdate(postId, {
      like: postLikes.filter((likes) => likes.toString() !== user._id),
    });
  } else {
    await postModel.findByIdAndUpdate(postId, {
      like: [...postLikes, user._id],
    });
  }
  res.status(200).json({ message: "success" });
});
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
