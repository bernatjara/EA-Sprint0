import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Chat from '../models/Chat';

const createChat = (req: Request, res: Response, next: NextFunction) => {
    const {roomId, connectedUsers, conversation} = req.body;

    const chat = new Chat({
        _id: new mongoose.Types.ObjectId(),
        roomId,
        connectedUsers,
        conversation
    });

    return chat
        .save()
        .then((chat) => res.status(200).json(chat))
        .catch((error) => res.status(500).json(error));
}

const readChat = (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;

    return Chat.findById(chatId)
        .populate('conversation')
        .then((chat) => (chat ? res.status(200).json(chat) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
}

const updateChat = (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    return Chat.findById(chatId)
        .then((chat) => {
            if (chat) {
                chat.set(req.body);

                return chat
                    .save()
                    .then((chat) => res.status(200).json(chat))
                    .catch((error) => res.status(500).json(error));   
            }else{
                res.status(404).json({ message: 'Chat not found' });
            }
        })
        .catch((error) => res.status(500).json(error));
}

const deleteChat = (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    return Chat.findByIdAndDelete(chatId)
        .then((chat) => (chat ? res.status(200).json({ message: 'Chat deleted' }) : res.status(404).json({ message: 'Chat not found' })))
        .catch((error) => res.status(500).json(error));
}

export default { createChat, readChat, updateChat, deleteChat };