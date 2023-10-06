import mongoose, { Document, Schema } from 'mongoose';

export interface IAsignatura {
    name: string;
    schedule: string[];
}

export interface IAsignaturaModel extends IAsignatura, Document {}

const AsignaturaSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        schedule: { type: Schema.Types.ObjectId, required: false, ref: 'Schedule' }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IAsignaturaModel>('Asignatura', AsignaturaSchema);
