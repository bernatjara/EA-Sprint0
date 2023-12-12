import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../models/User';
import { IAsignatura } from '../models/Asignatura';

export interface IRoom {
    users: IUser[];
    groupName: IAsignatura;
}

export interface IRoomModel extends IRoom, Document {}

const RoomSchema: Schema = new Schema(
    {
        users: { type: String, ref: 'User', required: true },
        groupName: { type: String, ref: 'Asignatura', required: true },
    },
    {
        versionKey: false
    }
);
export default mongoose.model<IRoomModel>('Room', RoomSchema);