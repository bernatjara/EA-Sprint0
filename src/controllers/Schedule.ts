import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Schedule from '../models/Schedule';

const createSchedule = (req: Request, res: Response, next: NextFunction) => {
    const { name, clase, start, duration } = req.body;

    const schedule = new Schedule({
        _id: new mongoose.Types.ObjectId(),
        name,
        clase,
        start,
        duration
    });

    return schedule
        .save()
        .then((schedule) => res.status(201).json(schedule))
        .catch((error) => res.status(500).json(error));
};

const readSchedule = (req: Request, res: Response, next: NextFunction) => {
    const scheduleId = req.params.scheduleId;

    return Schedule.findById(scheduleId)
        .then((schedule) => (schedule ? res.status(200).json(schedule) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};

const updateSchedule = (req: Request, res: Response, next: NextFunction) => {
    const scheduleId = req.params.scheduleId;

    return Schedule.findById(scheduleId)
        .then((schedule) => {
            if (schedule) {
                schedule.set(req.body);

                return schedule
                    .save()
                    .then((schedule) => res.status(201).json(schedule))
                    .catch((error) => res.status(500).json(error));
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((error) => res.status(500).json(error));
};

const deleteSchedule = (req: Request, res: Response, next: NextFunction) => {
    const scheduleId = req.params.scheduleId;

    return Schedule.findByIdAndDelete(scheduleId)
        .then((schedule) => (schedule ? res.status(201).json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};

export default { createSchedule, readSchedule, updateSchedule, deleteSchedule };
