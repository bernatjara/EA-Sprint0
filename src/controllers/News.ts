import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import News from '../models/News';

const createNews = (req: Request, res: Response, next: NextFunction) => {
    const { title, imageUrl, content } = req.body;

    const news = new News({
        _id: new mongoose.Types.ObjectId(),
        title,
        imageUrl,
        content
    });

    return news
        .save()
        .then((news) => res.status(200).json(news))
        .catch((error) => res.status(500).json(error));
};

const readNews = (req: Request, res: Response, next: NextFunction) => {
    const newsId = req.params.newsId;

    return News.findById(newsId)
        .then((news) => (news ? res.status(200).json(news) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};
async function paginate(page: number, limit: number): Promise<any> {
    try {
        const newss = await News.find()
            .skip((page - 1) * limit)
            .limit(limit);
        const totalPages = await News.countDocuments();
        const pageCount = Math.ceil(totalPages / limit);
        console.log({ totalPages, limit });
        console.log({ newss, pageCount });
        return { newss, pageCount };
    } catch (err) {
        console.log(err);
        return err;
    }
}
const readAll = async (req: Request, res: Response, next: NextFunction) => {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    console.log({ page, limit });
    // Comprueba si page y limit son números válidos
    if (isNaN(page) || isNaN(limit)) {
        return res.status(400).send({ error: 'Invalid page or limit' });
    }

    console.log({ page, limit });
    const response = await paginate(Number(page), Number(limit));
    res.send(response);
};

const dameTodo = (req: Request, res: Response, next: NextFunction) => {
    return News.find()
        .then((newss) => res.status(200).json(newss))
        .catch((error) => res.status(500).json(error));
}

const deleteNews = (req: Request, res: Response, next: NextFunction) => {
    const newsId = req.params.newsId;

    return News.findByIdAndDelete(newsId)
        .then((news) => (news ? res.status(200).json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};

export default { createNews, readNews, readAll, dameTodo, deleteNews };
