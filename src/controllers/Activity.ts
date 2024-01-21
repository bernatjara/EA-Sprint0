/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Activity from '../models/Activity'; // Assuming you have an Activity model

const createActivity = (req: Request, res: Response) => {
    const { lat, long, name, day, time, location } = req.body;

    const activity = new Activity({
        _id: new mongoose.Types.ObjectId(),
        lat,
        long,
        name,
        day,
        time,
        location
    });

    return activity
        .save()
        .then((activity) => res.status(200).json(activity))
        .catch((error) => res.status(500).json(error));
};

const readActivity = (req: Request, res: Response) => {
    const activityId = req.params.activityId;

    return Activity.findById(activityId)
        .then((activity) => (activity ? res.status(200).json(activity) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};

async function paginate(page: number, limit: number): Promise<any> {
    try {
        const activities = await Activity.find()
            .skip((page - 1) * limit)
            .limit(limit);
        const totalPages = await Activity.countDocuments();
        const pageCount = Math.ceil(totalPages / limit);
        return { activities, pageCount };
    } catch (err) {
        console.log(err);
        return err;
    }
}

const readAll = async (req: Request, res: Response) => {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    // Check if page and limit are valid numbers
    if (isNaN(page) || isNaN(limit)) {
        return res.status(400).send({ error: 'Invalid page or limit' });
    }
    const response = await paginate(Number(page), Number(limit));
    res.send(response);
};

const deleteActivity = (req: Request, res: Response) => {
    const activityId = req.params.activityId;

    return Activity.findByIdAndDelete(activityId)
        .then((activity) => (activity ? res.status(200).json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};

const getAllActivities = (req: Request, res: Response) => {
    return Activity.find()
        .then((activities) => res.status(200).json(activities))
        .catch((error) => res.status(500).json(error));
};

export default { createActivity, readActivity, readAll, deleteActivity, getAllActivities };
