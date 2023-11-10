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
const Schedule_1 = __importDefault(require("../models/Schedule"));
const createSchedule = (req, res, next) => {
    const { name, clase, start, duration } = req.body;
    const schedule = new Schedule_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
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
const readSchedule = (req, res, next) => {
    const scheduleId = req.params.scheduleId;
    return Schedule_1.default.findById(scheduleId)
        .then((schedule) => (schedule ? res.status(200).json(schedule) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};
function paginate(page, limit) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const schedules = yield Schedule_1.default.find()
                .skip((page - 1) * limit)
                .limit(limit);
            const totalPages = yield Schedule_1.default.countDocuments();
            const pageCount = Math.ceil(totalPages / limit);
            console.log({ totalPages, limit });
            console.log({ schedules, pageCount });
            return { schedules, pageCount };
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
    return Schedule_1.default.find()
        .then((schedules) => res.status(200).json(schedules))
        .catch((error) => res.status(500).json(error));
};
const updateSchedule = (req, res, next) => {
    return Schedule_1.default.findByIdAndUpdate(req.params.scheduleId, {
        name: req.body.name,
        clase: req.body.clase,
        start: req.body.start,
        duration: req.body.duration
    })
        .then((schedule) => (schedule ? res.status(201).json({ message: 'Done' }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
    /* const scheduleId = req.params.scheduleId;

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
        .catch((error) => res.status(500).json(error)); */
};
const deleteSchedule = (req, res, next) => {
    const scheduleId = req.params.scheduleId;
    return Schedule_1.default.findByIdAndDelete(scheduleId)
        .then((schedule) => (schedule ? res.status(201).json({ message: 'Deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json(error));
};
exports.default = { createSchedule, readSchedule, readAll, dameTodo, updateSchedule, deleteSchedule };
