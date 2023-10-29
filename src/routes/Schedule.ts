import express from 'express';
import controller from '../controllers/Schedule';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.schedule.create), controller.createSchedule);
router.get('/:scheduleId', controller.readSchedule);
router.get('/', controller.readAll);
router.put('/:scheduleId', ValidateSchema(Schemas.schedule.update), controller.updateSchedule);
router.delete('/:scheduleId', controller.deleteSchedule);

export = router;
