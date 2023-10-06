import mongoose, { Document, Schema } from 'mongoose';

export interface IBook {
    title: string;
    author: string;
    category: string;
    editorial: string;
}

export interface IBookModel extends IBook, Document {}

const BookSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        category: { type: String, required: true },
        author: { type: Schema.Types.ObjectId, required: true, ref: 'Author' },
        editorial: { type: String, required: true, default: 'Not defined' }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

export default mongoose.model<IBookModel>('Book', BookSchema);
