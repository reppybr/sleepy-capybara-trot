import { Router } from 'express';
import {
  createBatch,
  getBatchDetails,
  getBatchesForUser,
  addStageToBatch,
  transferCustody,
  finalizeBatch,
  addParticipantsToBatch,
} from '../controllers/batchController';

const router = Router();

router.post('/', createBatch); // Criar um novo lote (Brand Owner)
router.get('/:id', getBatchDetails); // Obter detalhes de um lote específico
router.get('/', getBatchesForUser); // Obter lotes para o usuário autenticado (filtrado por role/status)
router.post('/:id/stages', addStageToBatch); // Adicionar uma nova etapa a um lote (Current Holder)
router.put('/:id/transfer-custody', transferCustody); // Transferir custódia de um lote (Current Holder)
router.put('/:id/finalize', finalizeBatch); // Finalizar um lote (Brand Owner)
router.post('/:id/participants', addParticipantsToBatch); // Adicionar participantes a um lote (Brand Owner)

export default router;