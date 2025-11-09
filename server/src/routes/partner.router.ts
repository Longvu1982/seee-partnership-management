import express from 'express';
import * as PartnerController from '../controllers/partner.controller';
import { protectAuth } from '../middleware/auth-middleware';

const router = express.Router();

router.post('/list', protectAuth, PartnerController.listPartners);
router.post('/', protectAuth, PartnerController.createPartner);
router.put('/:id', protectAuth, PartnerController.updatePartner);
router.patch('/:id/status', protectAuth, PartnerController.updatePartnerStatus);

export default router;
