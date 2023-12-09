import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Response, Request } from 'express';
import Logging from '../library/Logging';
import { IUser } from '../models/User';
import { ISchedule } from '../models/Schedule';
import { IAsignatura } from '../models/Asignatura';
import { INews } from '../models/News';

export const ValidateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);

            next();
        } catch (error) {
            Logging.error(error);
            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    user: {
        create: Joi.object<IUser>({
            name: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.string().email().required(),
            asignatura: Joi.array().items(Joi.string().length(24).hex()),
            rol: Joi.string().required()
        }),
        update: Joi.object<IUser>({
            name: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.string().email().required(),
            newPassword: Joi.string(),
            asignatura: Joi.array().items(Joi.string().length(24).hex()),
            image: Joi.string()
        })
    },
    schedule: {
        create: Joi.object<ISchedule>({
            name: Joi.string().required(),
            clase: Joi.string().required(),
            start: Joi.number().required(),
            duration: Joi.number().required()
        }),
        update: Joi.object<ISchedule>({
            name: Joi.string().required(),
            clase: Joi.string().required(),
            start: Joi.number().required(),
            duration: Joi.number().required()
        })
    },
    asignatura: {
        create: Joi.object<IAsignatura>({
            name: Joi.string().required(),
            schedule: Joi.array() 
        }),
        update: Joi.object<IAsignatura>({
            name: Joi.string().required(),
            schedule: Joi.array().required()
        })
    },
    news:{
        create: Joi.object<INews>({
            title: Joi.string().required(),
            imageUrl: Joi.string().required(),
            content: Joi.string().required()
        }),
        update: Joi.object<INews>({
            newTitle: Joi.string().required(),
            title: Joi.string().required(),
            imageUrl: Joi.string().required(),
            content: Joi.string().required()
        })
    }
};
