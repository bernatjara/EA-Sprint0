import express from 'express';
import controller from '../controllers/Room';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router.post('/createroom', ValidateSchema(Schemas.room.create), controller.createRoom);
router.get('/readroom/:roomId', controller.readRoom);
router.get('/readrooms/:userId', controller.readRoomsByUserId); 
router.delete('/deleteroom/:roomId', controller.deleteRoom);

export = router;