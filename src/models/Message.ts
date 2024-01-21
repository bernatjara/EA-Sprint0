import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
    idUser: string;
    senderName: string;
    message: string;
}

export interface IMessageModel extends IMessage, Document {}

const MessageSchema: Schema = new Schema(
    {
        idUser: { type: Schema.Types.ObjectId, required: true, ref: 'user'},
        senderName: { type: String, required: true },
        message: { type: String, required: true }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IMessageModel>('message', MessageSchema);