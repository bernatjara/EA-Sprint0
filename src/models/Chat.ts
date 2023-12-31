import mongoose, { Document, Schema } from 'mongoose';

export interface IChat {
    roomId: string;
    connectedUsers: string[];
    conversation: string[];
}

export interface IChatModel extends IChat, Document {}

const ChatSchema: Schema = new Schema(
    {
        roomId: { type: String, required: true },
        connectedUsers: [{ type: String }],
        conversation: [{ type: Schema.Types.ObjectId, required: false, ref: 'message' }]
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IChatModel>('chat', ChatSchema);