import express from 'express';
import controller from '../controllers/Schedule';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/create', ValidateSchema(Schemas.schedule.create), controller.createSchedule);
router.get('/get/:scheduleId', controller.readSchedule);
router.patch('/update/:scheduleId', ValidateSchema(Schemas.schedule.update), controller.updateSchedule);
router.delete('/delete/:scheduleId', controller.deleteSchedule);

export = router;
