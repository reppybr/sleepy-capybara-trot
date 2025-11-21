import { Router } from 'express';
import { assignBrandOwnerRole } from '../controllers/adminController';

const router = Router();

router.post('/assign-brand-owner', assignBrandOwnerRole);

export default router;