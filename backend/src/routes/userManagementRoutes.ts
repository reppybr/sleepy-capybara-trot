import { Router } from 'express';
import { assignUserRole } from '../controllers/userManagementController';

const router = Router();

router.post('/assign-role', assignUserRole);

export default router;