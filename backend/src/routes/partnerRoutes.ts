import { Router } from 'express';
import {
  createConnectionRequest,
  getConnectionRequests,
  updateConnectionRequestStatus,
  getMyPartners,
} from '../controllers/partnerController';

const router = Router();

router.post('/requests', createConnectionRequest); // Enviar solicitação de conexão
router.get('/requests', getConnectionRequests); // Obter solicitações de conexão (recebidas/enviadas)
router.put('/requests/:id/status', updateConnectionRequestStatus); // Atualizar status da solicitação (aceitar/rejeitar)
router.get('/my-network', getMyPartners); // Obter parceiros conectados do usuário

export default router;