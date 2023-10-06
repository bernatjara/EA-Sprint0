import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Asignatura from '../models/Asignatura';

const createAsignatura = (req: Request, res: Response, next: NextFunction) => {
    const { name, schedule } = req.body;

    const asignatura = new Asignatura({
        _id: new mongoose.Types.ObjectId(),
        name,
        schedule
    });

    return asignatura
        .save()
        .then((asignatura) => res.status(201).json({ asignatura }))
        .catch((error) => res.status(500).json({ error }));
};

const readAsignatura = (req: Request, res: Response, next: NextFunction) => {
    const asignaturaId = req.params.asignaturaId;

    return Asignatura.findById(asignaturaId)
        .then((asignatura) => (asignatura ? res.status(200).json({ asignatura }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Asignatura.find()
        .then((asignaturas) => res.status(200).json({ asignaturas }))
        .catch((error) => res.status(500).json({ error }));
};

const updateAsignatura = (req: Request, res: Response, next: NextFunction) => {
    const asignaturaId = req.params.asignaturaId;

    return Asignatura.findById(asignaturaId)
        .then((asignatura) => {
            if (asignatura) {
                asignatura.set(req.body);

                return asignatura
                    .save()
                    .then((asignatura) => res.status(201).json({ asignatura }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteAsignatura = (req: Request, res: Response, next: NextFunction) => {
    const asignaturaId = req.params.asignaturaId;

    return Asignatura.findByIdAndDelete(asignaturaId)
        .then((asignatura) => (asignatura ? res.status(201).json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createAsignatura, readAsignatura, readAll, updateAsignatura, deleteAsignatura };
