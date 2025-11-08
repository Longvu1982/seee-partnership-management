import express from 'express';
import * as UserController from '../controllers/user.controller';
import { protectAuth } from '../middleware/auth-middleware';

const router = express.Router();

router.get('/:userId', protectAuth, UserController.getUserByID);

export default router;
