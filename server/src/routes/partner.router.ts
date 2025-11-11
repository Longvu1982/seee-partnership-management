import express from 'express';
import { Role } from '@prisma/client';
import * as PartnerController from '../controllers/partner.controller';
import { protectAuth, protectRoles } from '../middleware/auth-middleware';

const router = express.Router();

router.post('/list', protectAuth, PartnerController.listPartners);
router.post('/', protectAuth, PartnerController.createPartner);
router.put('/:id', protectAuth, PartnerController.updatePartner);
router.patch('/:id/status', protectAuth, PartnerController.updatePartnerStatus);
router.delete('/:id', protectAuth, protectRoles([Role.ADMIN]), PartnerController.deletePartner);

export default router;
