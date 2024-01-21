import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Chat from '../models/Chat';
import Asignatura from '../models/Asignatura';
import Message from '../models/Message';
import asignaturaController from '../controllers/Asignatura'

const createChat = async (req: Request, res: Response, next: NextFunction) => {
    const {roomId, conversation} = req.body;

    const chat = new Chat({
        _id: new mongoose.Types.ObjectId(),
        roomId,
        conversation
    });

    try {
        const savedChat = await chat.save();
        const updatedAsignatura = await asignaturaController.addChatToAsignatura(roomId, savedChat._id);

        if(updatedAsignatura){
            return res.status(200).json(savedChat);
        }else {
            return res.status(500).json({ message: 'Chat no guardado' });
        }
    }catch (err){
        return res.status(500).json(err);
    }

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
    const {roomId, idUser, senderName, message} = req.body; //id de la asignatura
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
                senderName,
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