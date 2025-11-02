import asyncHandler from "express-async-handler";
import prisma from "../config/db.js";


export const createRoom = asyncHandler(async (req, res) => {
    const { count_players } = req.body;
    if (count_players <= 0 || count_players > 6) {
        res.status(400);
        throw new Error("Numbers of Players should be in range 1 to 6");
    }
    const username = req.session.username;
    console.log(username);
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const roomId = `${username}${randomDigits}`;
    const room = await prisma.room.create({
        data: {
            id: roomId,
            username: username,
            count_players: count_players
        }
    });
    const nextSeat = 1;
    const game = await prisma.game.create({
        data: {
            room_id: roomId,
            count_players: count_players,
            players: [{
                username: username,
                seat: nextSeat,
                is_active: true
            }]
        }
    });
    if (game && room) {
        res.status(200).json({
            roomId: game.room_id,
            count_players: game.count_players,
            players: game.players,
            status: `${username} joined the room ${roomId}`,
        })
    }
    else {
        res.status(400);
        throw new Error("Failed to create room");
    }
});

export const joinRoom = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    console.log(roomId);
    const username = req.session.username;
    //Appendig user each time when they join room via roomId
    const gameRecord = await prisma.game.findUnique({ where: { room_id: roomId } });
    //Checking whether room exist or not
    if (gameRecord == false) {
        res.status(400);
        throw new Error("Room doesn't exist");
    };
    // Check if room already full
    if (gameRecord.players.length >= gameRecord.count_players) {
        res.status(400);
        throw new Error("Room is already full");
    };
    //Checking if user is already in the room
    if (gameRecord.players.includes(username)) {
        res.status(400);
        throw new Error("User already in this room");
    };
    const nextSeat = gameRecord.players.length + 1;
    const updatedPlayers = [
        ...(gameRecord.players || []),
        {
            username: username,
            seat: nextSeat,
            is_active: true,
        },
    ];
    const updatedgame = await prisma.game.update({
        where: { room_id: roomId },
        data: {
            players: updatedPlayers,
        },
    });
    if (updatedgame) {
        res.status(200).json({
            roomId: updatedgame.room_id,
            count_players: updatedgame.count_players,
            players: updatedgame.players,
            status: `${username} joined the room ${roomId} successfully`
        });
    }
    else {
        res.status(400);
        throw new Error(`${username} failed to join the room`);
    };
});