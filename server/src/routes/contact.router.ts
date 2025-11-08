import express from 'express';
import * as ContactController from '../controllers/contact.controller';
import { protectAuth } from '../middleware/auth-middleware';

const router = express.Router();

router.post('/list', protectAuth, ContactController.listContacts);

export default router;
