import mongoose, { Document, Schema } from 'mongoose';

export interface INews {
    newTitle: string,
    title: string;
    imageUrl: string;
    content: string;
    comments: Array<{ username: string, text: string, rating: number }>;    
    ratings: Array<number>;    
}

export interface INewsModel extends INews, Document {}

const NewsSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        imageUrl: { type: String, required: true },
        content: { type: String, required: true },
        comments: [{
            username: { type: String, required: true },
            text: { type: String, required: true },
            rating: { type: Number, required: true },
        }],
        ratings: [{ type: Number, required: true }]
        },
    {
        versionKey: false
    }
);

export default mongoose.model<INewsModel>('news', NewsSchema);
