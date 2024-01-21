import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Response, Request } from 'express';
import Logging from '../library/Logging';
import { IUser } from '../models/User';
import { ISchedule } from '../models/Schedule';
import { IAsignatura } from '../models/Asignatura';
import { INews } from '../models/News';
import { IActivity } from '../models/Activity';
import { IChat } from '../models/Chat';
import { IMessage } from '../models/Message';

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
            rol: Joi.string().required(),
            image: Joi.string()
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
            finish: Joi.number().required(),
            day: Joi.string().required(),
            year: Joi.number().required()
        }),
        update: Joi.object<ISchedule>({
            name: Joi.string().required(),
            clase: Joi.string().required(),
            start: Joi.number().required(),
            finish: Joi.number().required(),
            day: Joi.string().required(),
            year: Joi.number().required()
        })
    },
    asignatura: {
        create: Joi.object<IAsignatura>({
            name: Joi.string().required(),
            schedule: Joi.array(),
            chat: Joi.string(),
        }),
        update: Joi.object<IAsignatura>({
            name: Joi.string().required(),
            schedule: Joi.array().required(),
        })
    },
    news:{
        create: Joi.object<INews>({
            title: Joi.string().required(),
            imageUrl: Joi.string().required(),
            content: Joi.string().required(),
            mes: Joi.string()
        }),
        update: Joi.object<INews>({
            newTitle: Joi.string().required(),
            title: Joi.string().required(),
            imageUrl: Joi.string().required(),
            content: Joi.string().required(),
            mes: Joi.string()
        })
    },
    activity: {
        create: Joi.object<IActivity>({
            lat: Joi.number().required(),
            long: Joi.number().required(),
            name: Joi.string().required(),
            day: Joi.string().required(),
            time: Joi.string().required(),
            location: Joi.string().required(),
        
        }),
        update: Joi.object<IActivity>({
            lat: Joi.number().required(),
            long: Joi.number().required(),
            name: Joi.string().required(),
            day: Joi.string().required(),
            time: Joi.string().required(),
            location: Joi.string().required(),
        
        })
    },
    chat:{
        create: Joi.object<IChat>({
            roomId: Joi.string().required(),
            conversation: Joi.array()
        }),
    },
    message: {
        create: Joi.object<IMessage>({
            idUser: Joi.string().length(24).hex().required(),
            senderName: Joi.string().required(),
            message: Joi.string().required()
        }),
        update: Joi.object<IMessage>({
            idUser: Joi.string().length(24).hex().required(),
            senderName: Joi.string().required(),
            message: Joi.string().required()
        })
    }
};
