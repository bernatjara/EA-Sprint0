"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const createUser = (req, res, next) => {
    const { name, password, email, asignatura } = req.body;
    const user = new User_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        name,
        password,
        email,
        asignatura
    });
    return user
        .save()
        .then((user) => res.status(201).json(user))
        .catch((error) => res.status(500).json(error));
};
const readUser = (req, res, next) => {
    const userId = req.params.userId;
    return User_1.default.findById(userId)
        .then((user) => (user ? res.status(200).json(user) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};
function paginate(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield User_1.default.find()
                .skip((page - 1) * limit)
                .limit(limit);
            const totalPages = yield User_1.default.countDocuments();
            const pageCount = Math.ceil(totalPages / limit);
            console.log({ totalPages, limit });
            console.log({ users, pageCount });
            return { users, pageCount };
        }
        catch (err) {
            console.log(err);
            return err;
        }
    });
}
const readAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    console.log({ page, limit });
    // Comprueba si page y limit son números válidos
    if (isNaN(page) || isNaN(limit)) {
        return res.status(400).send({ error: 'Invalid page or limit' });
    }
    console.log({ page, limit });
    const response = yield paginate(Number(page), Number(limit));
    res.send(response);
});
const dameTodo = (req, res, next) => {
    return User_1.default.find()
        .then((users) => res.status(200).json(users))
        .catch((error) => res.status(500).json(error));
};
const updateUser = (req, res, next) => {
    const userId = req.params.userId;
    const { name, password, email, asignatura } = req.body;
    const user = new User_1.default({
        name,
        password,
        email,
        asignatura
    });
    console.log(user);
    return User_1.default.findByIdAndUpdate(userId, { name: user.name, password: user.password, email: user.email, asignatura: user.asignatura })
        .then((userOut) => (userOut ? res.status(200).json(user) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
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
const deleteUser = (req, res, next) => {
    const userId = req.params.userId;
    return User_1.default.findByIdAndDelete(userId)
        .then((user) => (user ? res.status(201).json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};
exports.default = { createUser, readUser, readAll, updateUser, deleteUser, dameTodo };
