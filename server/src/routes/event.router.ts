import express from 'express';
import * as EventController from '../controllers/event.controller';
import { protectAuth } from '../middleware/auth-middleware';

const router = express.Router();

router.post('/list', protectAuth, EventController.listEvents);

export default router;
