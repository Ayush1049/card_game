import express from 'express';
import {createRoom} from "../controllers/roomController.js";

const router = express.Router();

router.post("/create-room", createRoom);
// router.post("/join-room/:room.id", joinRoom);

export default router