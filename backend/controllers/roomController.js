import asyncHandler from "express-async-handler";
import prisma from "../config/db.js";


export const createRoom = asyncHandler(async(req,res)=>{
    const {count_players} = req.body;
    if(count_players<=0 || count_players>6)
    {
        res.status(400);
        throw new Error("Numbers of Players should be in range 1 to 6");
    }
    const username = req.session.username;
    console.log(username);
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const roomId = `${username}${randomDigits}`;
    console.log(roomId);
    const room = await prisma.room.create({
        data: {
            id: roomId,
            count_players: count_players
        },
    });
    if(room)
    {
        res.status(200).json({
            id:room.id,
            count_players:room.count_players,
            status:"Room created successfully",
        })
    }
    else{
        res.status(400);
        throw new Error("Failed to create room");
    }
})

// export const joinRoom = asyncHandler(async(res,req)=>{})