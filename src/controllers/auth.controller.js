import { db } from "../libs/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    // Registration logic here
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // jwt token generation can be added here

    const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Send response
    const cookiesOptions = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, cookiesOptions);

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  // Login logic here
  const { email, password } = req.body;

  const user = await db.user.findUnique({ where: { email },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  //jwt token generation can be added here

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const cookiesOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.cookie("token", token, cookiesOptions);

  res.status(200).json({ message: "Login successful", });
};

const logoutUser = (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await db.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: user,
    });
  } catch (error) {}
};

export { registerUser, loginUser, logoutUser, getUserProfile };
