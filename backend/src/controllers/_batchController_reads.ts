import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { PartnerRoleKey } from '../types/forms';

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
  const { public_key: userPublicKey } = req.user!;
  const { status, type } = req.query;

  try {
    // Etapa 1: Buscar os lotes básicos
    let query = supabase
      .from('batches')
      .select(`
        id,
        onchain_id,
        producer_name,
        current_holder_key,
        status,
        created_at,
        brands (name)
      `);

    if (status) {
      query = query.eq('status', status as string);
    }

    if (type === 'my-batches') {
      query = query.eq('brand_owner_key', userPublicKey);
    } else if (type === 'my-tasks') {
      query = query.eq('current_holder_key', userPublicKey);
    } else {
      query = query.or(`brand_owner_key.eq.${userPublicKey},current_holder_key.eq.${userPublicKey}`);
    }

    const { data: batches, error: batchesError } = await query;

    if (batchesError) throw batchesError;
    if (!batches || batches.length === 0) return res.status(200).json([]);

    const batchIds = batches.map(b => b.id);
    const holderKeys = [...new Set(batches.map(b => b.current_holder_key).filter(Boolean))];

    // Etapa 2: Buscar dados relacionados em paralelo
    const [
      { data: stageLogs, error: stageLogsError },
      { data: users, error: usersError }
    ] = await Promise.all([
      supabase
        .from('stage_logs')
        .select('batch_id, metadata')
        .in('batch_id', batchIds)
        .order('created_at', { ascending: true }),
      supabase
        .from('users')
        .select('public_key, name, role')
        .in('public_key', holderKeys)
    ]);

    if (stageLogsError) throw stageLogsError;
    if (usersError) throw usersError;

    // Etapa 3: Mapear os dados para fácil acesso
    const usersMap = new Map(users.map(u => [u.public_key, u]));
    const firstStageLogsMap = new Map<string, any>();
    if (stageLogs) {
      for (const log of stageLogs) {
        if (!firstStageLogsMap.has(log.batch_id)) {
          firstStageLogsMap.set(log.batch_id, log);
        }
      }
    }

    // Etapa 4: Combinar os dados
    const processedBatches = batches.map(batch => {
      const firstStage = firstStageLogsMap.get(batch.id);
      const variety = firstStage?.metadata?.variety || null;
      const holderInfo = usersMap.get(batch.current_holder_key) || { name: 'Desconhecido', role: 'unknown' };
      
      return { 
        ...batch, 
        variety,
        users: {
          name: holderInfo.name,
          role: holderInfo.role
        }
      };
    });

    return res.status(200).json(processedBatches);
  } catch (error: any) {
    console.error('Error fetching batches for user:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

export const getBatchDetails = async (req: AuthenticatedRequest, res: Response) => {
  const { id: batchId } = req.params;
  try {
    // Etapa 1: Buscar detalhes do lote e chaves dos participantes
    const { data: batchDetails, error: detailsError } = await supabase
      .from('batches')
      .select(`
        *,
        batch_participants:batch_participants!batch_id(partner_public_key, created_at)
      `)
      .eq('id', batchId)
      .single();

    if (detailsError) throw detailsError;
    if (!batchDetails) return res.status(404).json({ error: 'Batch not found.' });

    // Etapa 2: Buscar as etapas
    const { data: stages, error: stagesError } = await supabase
      .from('stage_logs')
      .select('*')
      .eq('batch_id', batchId)
      .order('created_at', { ascending: true });
    
    if (stagesError) throw stagesError;

    // Etapa 3: Coletar todas as chaves públicas de participantes e atores das etapas
    const participantKeys = batchDetails.batch_participants.map((p: any) => p.partner_public_key);
    const actorKeys = stages.map((s: any) => s.added_by_key);
    const allKeys = [...new Set([...participantKeys, ...actorKeys])];

    // Etapa 4: Buscar todos os perfis de usuário necessários de uma só vez
    const { data: userProfiles, error: profilesError } = await supabase
      .from('users')
      .select('auth_user_id, name, email, public_key, role')
      .in('public_key', allKeys);

    if (profilesError) throw profilesError;

    const profilesMap = new Map(userProfiles.map(p => [p.public_key, p]));

    // Etapa 5: Combinar todos os dados
    const finalParticipants = batchDetails.batch_participants.map((p: any) => ({
      partner: {
        id: profilesMap.get(p.partner_public_key)?.auth_user_id,
        ...profilesMap.get(p.partner_public_key)
      },
      joined_at: p.created_at
    }));

    const processedStages = stages.map((stage: any) => ({
      id: stage.id,
      type: stage.partner_type,
      title: stage.stage_name,
      actor: profilesMap.get(stage.added_by_key)?.name || 'Sistema',
      actor_public_key: stage.added_by_key,
      timestamp: stage.created_at,
      hash: stage.transaction_signature,
      status: 'completed',
      formData: stage.metadata,
    }));
    
    batchDetails.batch_participants = finalParticipants;

    return res.status(200).json({ details: batchDetails, stages: processedStages });
  } catch (error: any) {
    console.error(`Error fetching details for batch ${batchId}:`, error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

export const addParticipantsToBatch = async (req: AuthenticatedRequest, res: Response) => {
  const { id: batchId } = req.params;
  const { new_participant_public_keys } = req.body;
  const { role: userRole } = req.user!;

  if (userRole !== 'brand_owner') {
    return res.status(403).json({ error: 'Forbidden: Only Brand Owners can add participants.' });
  }

  if (!new_participant_public_keys || !Array.isArray(new_participant_public_keys) || new_participant_public_keys.length === 0) {
    return res.status(400).json({ error: 'Participant public keys are required.' });
  }

  try {
    const participantsToAdd = new_participant_public_keys.map(pk => ({
      batch_id: batchId,
      partner_public_key: pk,
    }));

    const { error } = await supabase
      .from('batch_participants')
      .insert(participantsToAdd);

    if (error) {
      if (error.code === '23505') { // violação de chave única
        return res.status(409).json({ error: 'One or more participants are already in the batch.' });
      }
      throw error;
    }

    return res.status(200).json({ message: 'Participants added successfully.' });
  } catch (error: any) {
    console.error(`Error adding participants to batch ${batchId}:`, error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};