import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Message from '../models/Message';

const createMessage = (req: Request, res: Response) => {
    const {idUser, senderName, message} = req.body;

    const data = new Message({
        _id: new mongoose.Types.ObjectId(),
        idUser,
        senderName,
        message
    });

    return data
        .save()
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(500).json(error));
}

const readMessage = (req: Request, res: Response) => {
    const messageId = req.params.messageId;

    return Message.findById(messageId)
        .then((message) => (message ? res.status(200).json(message) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
}

const readAll = (req: Request, res: Response) => {
    return Message.find()
        .then((messages) => res.status(200).json(messages))
        .catch((error) => res.status(500).json(error));
}

const updateMessage = (req: Request, res: Response) => {
    const messageId = req.params.messageId;
    return Message.findById(messageId)
        .then((message) => {
            if (message) {
                message.set(req.body);

                return message
                    .save()
                    .then((message) => res.status(200).json(message))
                    .catch((error) => res.status(500).json(error));
            }else{
                res.status(404).json({ message: 'Message not found' });
            }
        })
        .catch((error) => res.status(500).json(error));
}

const deleteMessage = (req: Request, res: Response) => {
    const messageId = req.params.messageId;
    return Message.findByIdAndDelete(messageId)
        .then((message) => (message ? res.status(200).json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
}

export default { createMessage, readMessage, readAll, updateMessage, deleteMessage };