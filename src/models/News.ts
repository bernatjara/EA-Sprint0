import mongoose, { Document, Schema } from 'mongoose';

export interface INews {
    title: string;
    imageUrl: string;
    content: string;
}

export interface INewsModel extends INews, Document {}

const NewsSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        imageUrl: { type: String, required: true },
        content: { type: String, required: true }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<INewsModel>('news', NewsSchema);
