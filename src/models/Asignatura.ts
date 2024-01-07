import mongoose, { Document, Schema } from 'mongoose';
import { ISchedule } from './Schedule';
import { IChat } from './Chat';

export interface IAsignatura {
    name: string;
    schedule: ISchedule[];
    chat: IChat;
}

export interface IAsignaturaModel extends IAsignatura, Document {}

const AsignaturaSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        schedule: [{ type: Schema.Types.ObjectId, required: false, ref: 'schedule' }],
        chat: {type: Schema.Types.ObjectId, required: false, ref: 'chat'}
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IAsignaturaModel>('asignatura', AsignaturaSchema);
