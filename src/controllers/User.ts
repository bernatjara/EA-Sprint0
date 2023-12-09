import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const passToken = process.env.passwordToken || '';
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { name, password, email, asignatura, rol } = req.body;

    const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name,
        password,
        email,
        asignatura,
        rol
    });
    user.password = await user.encryptPassword(user.password);
    return user
        .save()
        .then((user) => res.status(200).json(user))
        .catch((error) => res.status(500).json(error));
};

const readUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    return User.findById(userId)
        .then((user) => (user ? res.status(200).json(user) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};

async function paginate(page: number, limit: number): Promise<any> {
    try {
        const users = await User.find()
            .skip((page - 1) * limit)
            .limit(limit);
        const totalPages = await User.countDocuments();
        const pageCount = Math.ceil(totalPages / limit);
        console.log({ totalPages, limit });
        console.log({ users, pageCount });
        return { users, pageCount };
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
    return User.find()
        .then((users) => res.status(200).json(users))
        .catch((error) => res.status(500).json(error));
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const { name, password, email, asignatura, newPassword } = req.body;
    const user = new User({
        name,
        password,
        email,
        asignatura
    });console.log('nombre ' + name);
    console.log('asignatura: ' + asignatura);

    const userPass = await User.findOne({name});
    if(!userPass){
        return res.status(404).send("No existe");
    }
    else{
        const validPassword = await userPass.validatePassword(password);
        if (!validPassword) {
            return res.status(401).json({ auth: false});
        }
        const newPass = await user.encryptPassword(newPassword);
        const user2 = await User.findByIdAndUpdate(userId, { name: user.name, password: newPass, email: user.email, asignatura: user.asignatura });
        if(!user2) {
            return res.status(404).send('Usuario no encontrado');
        }
        else{
            return User.findById(userId)
                .then((userOut) => (userOut ? res.status(200).json(userOut) : res.status(404).json({ message: 'Not found' })))
                .catch((error) => res.status(500).json(error));
        }
            /* .then((userOut) => (userOut ? res.status(200).json(user) : res.status(404).json({ message: 'Not found' })))
            .catch((error) => res.status(500).json(error)); */

    }
    /* return User.findById(userId)
        .then((user) => {
            if (user) {
                user.set(req.body);

                return user
                    .save()
                    .then((user) => 
                        res.status(201).json(user))
            
                    .catch((error) => {
                        console.log("save", error);
                        res.status(500).json(error);
                    });
                    
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((error) => res.status(500).json(error)); */
};

const updateAsignatura = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const { name, password, email, asignatura} = req.body;
    const user = new User({
        name,
        password,
        email,
        asignatura
    });
    const user2 = await User.findByIdAndUpdate(userId, { name: user.name, password: user.password, email: user.email, asignatura: user.asignatura });
    return User.findById(userId)
                .then((userOut) => (userOut ? res.status(200).json(userOut) : res.status(404).json({ message: 'Not found' })))
                .catch((error) => res.status(500).json(error));
};

const updateImage = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const { name, password, email, image} = req.body;
    const user = new User({
        name,
        password,
        email,
        image
    });
    const user2 = await User.findByIdAndUpdate(userId, { name: user.name, password: user.password, email: user.email, image: user.image });
    return User.findById(userId)
                .then((userOut) => (userOut ? res.status(200).json(userOut) : res.status(404).json({ message: 'Not found' })))
                .catch((error) => res.status(500).json(error));
};

const deleteUser = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    return User.findByIdAndDelete(userId)
        .then((user) => (user ? res.status(200).json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};

const login = async (req: Request, res: Response, next: NextFunction) =>{
    const { name, password } = req.body;
    const user = await User.findOne({name});
    if (!user) {
        return res.status(404).send("El nombre no existe");
    }
    const validPassword = await user.validatePassword(password);
    if (!validPassword) {
      return res.status(401).json({ auth: false, token: null });
    }
    const token = jwt.sign({ id: user._id, rol: user.rol}, passToken, {
      expiresIn: 60 * 60 * 24,
    });
    return res.json({ auth: true, token, user});       
}

export default { createUser, readUser, readAll, updateUser, deleteUser, dameTodo, login, updateAsignatura, updateImage };