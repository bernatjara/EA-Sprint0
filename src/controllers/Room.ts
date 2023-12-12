import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Room from '../models/Room';
import User from '../models/User';

const createRoom = async (req: Request, res: Response, next: NextFunction) => {
    const { asignatura } = req.body;

    try {
        const users = await User.find(asignatura);

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'User not found in the database'});
        }
        const room = new Room({
            _id: new mongoose.Types.ObjectId(),
            users: users, 
            asignatura: asignatura,
        });

        const newRoom = await room.save();
        return res.status(201).json(newRoom);
    } catch (error) {
        return res.status(500).json({ error });
    }
};
const readRoom = (req: Request, res: Response, next: NextFunction) => {
    const roomId = req.params.roomId;

    return Room.findById(roomId)
        .then((room) => (room ? res.status(200).json( room ) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readRoomsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    try {
        const rooms = await Room.find({ $or: [{ userId1: userId }] });

        if (rooms.length === 0) {
            return res.status(404).json({ message: 'No rooms found for the user' });
        }
        return res.status(200).json({rooms});
    } catch (error) {
        return res.status(500).json({ error });
    }
};
const deleteRoom = (req: Request, res: Response, next: NextFunction) => {
    const roomId = req.params.roomId;

    return Room.findByIdAndDelete(roomId)
        .then((room) => (room ? res.status(201).json({ room, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createRoom, readRoom, deleteRoom, readRoomsByUserId };