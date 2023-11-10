"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const Asignatura_1 = __importDefault(require("../controllers/Asignatura"));
const ValidateSchema_1 = require("../middleware/ValidateSchema");
const router = express_1.default.Router();
router.post('/', (0, ValidateSchema_1.ValidateSchema)(ValidateSchema_1.Schemas.asignatura.create), Asignatura_1.default.createAsignatura);
router.get('/:asignaturaId', Asignatura_1.default.readAsignatura);
router.get('/', Asignatura_1.default.dameTodo);
router.get('/page/:page/:limit', Asignatura_1.default.readAll);
router.get('/user/:id', Asignatura_1.default.getAsignaturasOfUser);
router.put('/:asignaturaId', (0, ValidateSchema_1.ValidateSchema)(ValidateSchema_1.Schemas.asignatura.update), Asignatura_1.default.updateAsignatura);
router.delete('/:asignaturaId', Asignatura_1.default.deleteAsignatura);
module.exports = router;
