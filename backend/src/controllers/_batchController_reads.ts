import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { PartnerRoleKey } from '../types/forms'; // Importar o tipo de role

// Assumindo que o req.user é populado por um middleware de autenticação
interface AuthenticatedRequest extends Request {
  user?: {
    auth_user_id: string;
    public_key: string;
    role: PartnerRoleKey;
    email: string;
    name: string;
  };
}

export const getBatchesForUser = async (req: AuthenticatedRequest, res: Response) => {
  const { public_key: userPublicKey, role: userRole } = req.user!;
  const { status, type } = req.query; // 'status' para filtrar, 'type' para 'my-batches' (brand owner) ou 'my-tasks' (workers)

  try {
    let query = supabase
      .from('batches')
      .select(`
        id,
        onchain_id,
        producer_name,
        current_holder_key,
        status,
        created_at,
        brands (name),
        users:users!current_holder_key(name, role),
        stage_logs(metadata)
      `);

    if (status) {
      query = query.eq('status', status as string);
    }

    if (type === 'my-batches') {
      query = query.eq('brand_owner_key', userPublicKey);
    } else if (type === 'my-tasks') {
      query = query.eq('current_holder_key', userPublicKey);
    } else {
      // Fallback para outros casos. A RLS (Row Level Security) já protege os dados.
      // O filtro .or() anterior era complexo e causava erros.
      // Esta versão simplificada cobre os casos principais para uma visão geral.
      query = query.or(`brand_owner_key.eq.${userPublicKey},current_holder_key.eq.${userPublicKey}`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Pós-processamento para adicionar a variedade do primeiro log de etapa
    const processedBatches = data.map(batch => {
        const firstStage = Array.isArray(batch.stage_logs) && batch.stage_logs.length > 0 ? batch.stage_logs[0] : null;
        const variety = firstStage?.metadata?.variety || null;
        // remove stage_logs para manter o payload pequeno
        const { stage_logs, ...rest } = batch;
        return { ...rest, variety };
    });

    return res.status(200).json(processedBatches);
  } catch (error: any) {
    console.error('Error fetching batches for user:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

// As outras funções permanecem as mesmas...
export { createBatch, getBatchDetails, addStageToBatch, transferCustody, finalizeBatch, addParticipantsToBatch } from './_batchController_reads';