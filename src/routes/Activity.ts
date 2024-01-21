import express from 'express';
import controller from '../controllers/Activity';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.activity.create), controller.createActivity);
router.get('/:activityId', controller.readActivity);
router.get('/', controller.getAllActivities);
router.get('/page/:page/:limit', controller.readAll);
router.delete('/:activityId', controller.deleteActivity);

export = router;