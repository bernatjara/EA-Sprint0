import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity {
    lat: number;
    long: number;
    name: string;
    day: string;
    time: string;
    location: string;
}

export interface IActivityModel extends IActivity, Document {}

const ActivitySchema: Schema = new Schema(
    {
        lat: { type: Number, required: true },
        long: { type: Number, required: true },
        name: { type: String, required: true },
        day: { type: String, required: true },
        time: { type: String, required: true},
        location: { type: String, required: true}
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IActivityModel>('activity', ActivitySchema);

