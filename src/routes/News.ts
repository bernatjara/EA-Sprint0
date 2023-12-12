import express from 'express';
import controller from '../controllers/News';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';
import {verifyToken} from '../middleware/verifyToken';

const router = express.Router();
router.post('/', verifyToken, ValidateSchema(Schemas.news.create), controller.createNews);
router.get('/:newsId', controller.readNews);
router.get('/:page/:limit', controller.readAll);
router.get('/', controller.dameTodo);
router.put('/:newsId', ValidateSchema(Schemas.news.update), controller.updateNews);
router.delete('/:newsId', controller.deleteNews);
router.post('/:newsId', controller.createComment);

export = router;
