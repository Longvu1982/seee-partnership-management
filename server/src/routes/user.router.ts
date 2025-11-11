import express from 'express';
import { Role } from '@prisma/client';
import * as UserController from '../controllers/user.controller';
import { protectAuth, protectRoles } from '../middleware/auth-middleware';

const router = express.Router();

router.get('/:userId', protectAuth, UserController.getUserByID);
router.post('/list', protectAuth, UserController.listUsers);
router.post('/', protectAuth, protectRoles([Role.ADMIN]), UserController.createUser);
router.put('/:id', protectAuth, protectRoles([Role.ADMIN, Role.USER]), UserController.updateUser);
router.patch('/:id/status', protectAuth, UserController.updateUserStatus);

export default router;
