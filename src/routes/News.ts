import express from 'express';
import controller from '../controllers/News';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';
import {verifyToken} from '../middleware/verifyToken';

const router = express.Router();
router.post('/', ValidateSchema(Schemas.news.create), verifyToken, controller.createNews); //fet
router.get('/:newsId', controller.readNews);
router.get('/:page/:limit', controller.readAll);
router.get('/', controller.dameTodo);
router.put('/:newsId', ValidateSchema(Schemas.news.update), verifyToken, controller.updateNews); //fet
router.delete('/:newsId', verifyToken, controller.deleteNews); //fet
router.post('/:newsId', verifyToken, controller.createComment); //fet

export = router;
