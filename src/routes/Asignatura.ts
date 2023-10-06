import express from 'express';
import controller from '../controllers/Asignatura';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/create', ValidateSchema(Schemas.asignatura.create), controller.createAsignatura);
router.get('/get/:asignaturaId', controller.readAsignatura);
router.get('/get/', controller.readAll);
router.patch('/update/:asignaturaId', ValidateSchema(Schemas.asignatura.update), controller.updateAsignatura);
router.delete('/delete/:asignaturaId', controller.deleteAsignatura);

export = router;
