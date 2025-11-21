import { Router } from 'express';
import { getUserProfile, updateMyProfile, getAllUsers } from '../controllers/userController';

const router = Router();

router.get('/:publicKey', getUserProfile); // Obter perfil de um usuário específico
router.put('/me', updateMyProfile); // Atualizar o perfil do usuário autenticado
router.get('/', getAllUsers); // Obter todos os usuários (requer autorização)

export default router;