import express from 'express';
import controller from '../controllers/User';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';
import verifyToken from '../middleware/verifyToken';

const router = express.Router();

router.post('/', ValidateSchema(Schemas.user.create), controller.createUser);
router.get('/:userId', controller.readUser);
router.get('/:page/:limit', [verifyToken], controller.readAll);
router.get('/', controller.dameTodo);
router.post('/login/login/login', controller.login);
router.put('/:userId', ValidateSchema(Schemas.user.update), controller.updateUser);
router.delete('/:userId', controller.deleteUser);

export = router;
