import express from 'express';
import controller from '../controllers/Chat';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.chat.create), controller.createChat);
router.get('/:chatId', controller.readChat);
router.put('/:chatId', controller.updateChat);
router.delete('/:chatId', controller.deleteChat);

export = router;