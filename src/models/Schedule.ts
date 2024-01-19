import mongoose, { Document, Schema } from 'mongoose';

export interface ISchedule {
    name: string;
    clase: string;
    start: number;
    finish: number;
    day: string;
    year: number,
}

export interface IScheduleModel extends ISchedule, Document {}

const ScheduleSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        clase: { type: String, required: true },
        start: { type: Number, required: true },
        finish: { type: Number, required: true },
        day: { type: String, required: true},
        year: {type: Number, required: true}
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IScheduleModel>('schedule', ScheduleSchema);
