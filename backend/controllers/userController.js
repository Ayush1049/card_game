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
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
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
    const { email, password} = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    const isMatchPassword = await bcrypt.compare(password,user.password);
    if(user && isMatchPassword)
    {
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            status: "User login successfully",
        });
    }
    else {
        res.status(400);
        throw new Error("Failed to login the user");
    }
});