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
const Asignatura_1 = __importDefault(require("../models/Asignatura"));
const User_1 = __importDefault(require("../models/User"));
const createAsignatura = (req, res, next) => {
    const { name, schedule } = req.body;
    const asignatura = new Asignatura_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        name,
        schedule
    });
    return asignatura
        .save()
        .then((asignatura) => res.status(201).json(asignatura))
        .catch((error) => res.status(500).json(error));
};
const readAsignatura = (req, res, next) => {
    const asignaturaId = req.params.asignaturaId;
    return Asignatura_1.default.findById(asignaturaId)
        .then((asignatura) => (asignatura ? res.status(200).json(asignatura) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};
function paginate(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const asignaturas = yield Asignatura_1.default.find()
                .skip((page - 1) * limit)
                .limit(limit);
            const totalPages = yield Asignatura_1.default.countDocuments();
            const pageCount = Math.ceil(totalPages / limit);
            console.log({ totalPages, limit });
            console.log({ asignaturas, pageCount });
            return { asignaturas, pageCount };
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
    return Asignatura_1.default.find()
        .then((asignaturas) => res.status(200).json(asignaturas))
        .catch((error) => res.status(500).json(error));
};
const updateAsignatura = (req, res, next) => {
    const asignaturaId = req.params.asignaturaId;
    return Asignatura_1.default.findById(asignaturaId)
        .then((asignatura) => {
        if (asignatura) {
            asignatura.set(req.body);
            return asignatura
                .save()
                .then((asignatura) => res.status(201).json(asignatura))
                .catch((error) => res.status(500).json(error));
        }
        else {
            res.status(404).json({ message: 'Not found' });
        }
    })
        .catch((error) => res.status(500).json(error));
};
const deleteAsignatura = (req, res, next) => {
    const asignaturaId = req.params.asignaturaId;
    return Asignatura_1.default.findByIdAndDelete(asignaturaId)
        .then((asignatura) => (asignatura ? res.status(201).json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};
const getAllAsignaturasByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const responseItem = yield User_1.default.findOne({ _id: userId }).populate('asignatura');
    return responseItem;
});
const getAsignaturasOfUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = req.params.id;
        console.log(idUser);
        const response = yield getAllAsignaturasByUser(idUser);
        const data = response ? response : 'NOT_FOUND';
        res.send(data);
    }
    catch (err) {
        console.log(err);
        return err;
    }
});
exports.default = { createAsignatura, readAsignatura, readAll, dameTodo, updateAsignatura, deleteAsignatura, getAsignaturasOfUser };
