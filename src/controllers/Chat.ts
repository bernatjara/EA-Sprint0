import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Chat from '../models/Chat';
import Asignatura from '../models/Asignatura';
import Message from '../models/Message';

const createChat = (req: Request, res: Response, next: NextFunction) => {
    const {roomId, conversation} = req.body;

    const chat = new Chat({
        _id: new mongoose.Types.ObjectId(),
        roomId,
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

const updateChat = async (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    const roomId = req.body; //id de la asignatura
    const idUser = req.body; //id del usuario
    const message = req.body; //mensaje a guardar

    // primero buscamos la asignatura y que el chat exista.

    const asignatura = await Asignatura.findById(roomId);
    if(!asignatura){
        return res.status(404).json({ message: 'Asignatura no encontrada' });
    }
    else {
        const chat = await Chat.findById(chatId);
        if(!chat){
            return res.status(404).json({ message: 'Chat no encontrado' });
        }
        else{
            const mensaje = new Message({
                _id: new mongoose.Types.ObjectId(),
                idUser,
                message
            })

            chat.conversation.push(mensaje._id);
            await mensaje.save();
            await chat.save();
            return chat
                .save()
                .then((chat) => res.status(200).json(chat))
                .catch((error) => res.status(500).json(error));
        }
    }
}

const deleteChat = (req: Request, res: Response, next: NextFunction) => {
    const chatId = req.params.chatId;
    return Chat.findByIdAndDelete(chatId)
        .then((chat) => (chat ? res.status(200).json({ message: 'Chat deleted' }) : res.status(404).json({ message: 'Chat not found' })))
        .catch((error) => res.status(500).json(error));
}

export default { createChat, readChat, updateChat, deleteChat };