import express from 'express';
import {createRoom,joinRoom} from "../controllers/roomController.js";

const router = express.Router();

router.post("/create-room", createRoom);
router.post("/:roomId", joinRoom);

export default router