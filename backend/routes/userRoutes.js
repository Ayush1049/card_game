import express from "express";
import { loginUser, registerUser, getAllUsers} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/", getAllUsers);

export default router;
