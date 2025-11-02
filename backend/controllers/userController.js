import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import prisma from "../config/db.js";

//get all users
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

//register user
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password} = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Feilds");
    }
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const userId = randomDigits;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            id:userId,
            name,
            email,
            password:hashedPassword
        },
    });
    if (user) {
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            status: "User created successfully",
        });
    } else {
        res.status(400);
        throw new Error("Failed to create the user");
    }

});

//login user
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const isMatchPassword = await bcrypt.compare(password, user.password);

  if (!isMatchPassword) {
    return res.status(401).json({ message: "Invalid password" });
  }
    // ✅ Await regeneration safely
  await new Promise((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  req.session.username = user.name;
  req.session.userid = user.id;
  console.log("New session for:", req.session.username);


  console.log("Session created:", req.session.username);

  res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    status: "User login successful",
  });
});