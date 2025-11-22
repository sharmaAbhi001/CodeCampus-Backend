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
       if(existingUser.provider === 'GOOGLE_PROVIDER'){
        return res.status(400).json({ 
          success:false,
          message: "User already exists" });
       }
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        provider:"LOCAL_PROVIDER",
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
       secure: true,         
  sameSite: 'none'
    };
    res.cookie("token", token, cookiesOptions);

    const user = await db.user.findUnique({
      where: {
        id: newUser.id, 
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });


    res
      .status(201)
      .json({
        success:true,
        message:"Registration successful",
        data:user 
      });



  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  // Login logic here
  const { email, password } = req.body;

  const user = await db.user.findUnique({ where: { email }});
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if(user){
    if(user.provider === 'GOOGLE_PROVIDER'){
      return res.status(401).json({
        success:false,
        message:"Please login with google"
      })
    }
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
     secure: true,         
  sameSite: 'none'
  };

  res.cookie("token", token, cookiesOptions);

  res.status(200).json({ 
    success:true,
    message:"Login successful",
    data:{ id: user.id, email: user.email, name: user.name, role: user.role }
  });
};

const logoutUser = (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,         
  sameSite: 'none'
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
        image :true,
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
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export { registerUser, loginUser, logoutUser, getUserProfile };
