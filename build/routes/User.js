"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../controllers/User"));
const ValidateSchema_1 = require("../middleware/ValidateSchema");
const router = express_1.default.Router();
router.post('/', (0, ValidateSchema_1.ValidateSchema)(ValidateSchema_1.Schemas.user.create), User_1.default.createUser);
router.get('/:userId', User_1.default.readUser);
router.get('/:page/:limit', User_1.default.readAll);
router.get('/', User_1.default.dameTodo);
router.put('/:userId', (0, ValidateSchema_1.ValidateSchema)(ValidateSchema_1.Schemas.user.update), User_1.default.updateUser);
router.delete('/:userId', User_1.default.deleteUser);
module.exports = router;
