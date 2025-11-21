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

export const createBatch = async (req: AuthenticatedRequest, res: Response) => {
  const {
    onchain_id,
    brand_id,
    producer_name,
    current_holder_key,
    initial_stage_data, // Dados da primeira etapa (criação)
    participants_public_keys, // Chaves públicas dos participantes iniciais
  } = req.body;
  const { public_key: brandOwnerPublicKey, role: userRole } = req.user!;

  if (userRole !== 'brand_owner') {
    return res.status(403).json({ error: 'Forbidden: Only Brand Owners can create batches.' });
  }

  try {
    // 1. Verificar se o brand_id pertence ao Brand Owner
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id, owner_public_key')
      .eq('id', brand_id)
      .eq('owner_public_key', brandOwnerPublicKey)
      .single();

    if (brandError || !brand) {
      return res.status(403).json({ error: 'Forbidden: Brand does not belong to this Brand Owner.' });
    }

    // 2. Inserir o novo lote
    const { data: newBatch, error: batchError } = await supabase
      .from('batches')
      .insert({
        onchain_id,
        brand_id,
        producer_name,
        current_holder_key,
        status: 'processing', // Status inicial
        onchain_next_stage_index: 0,
        brand_owner_key: brandOwnerPublicKey, // Adicionar brand_owner_key
      })
      .select()
      .single();

    if (batchError) {
      throw batchError;
    }

    // 3. Inserir os participantes do lote
    const batchParticipants = participants_public_keys.map((pk: string) => ({
      batch_id: newBatch.id,
      partner_public_key: pk,
    }));

    const { error: participantsError } = await supabase
      .from('batch_participants')
      .insert(batchParticipants);

    if (participantsError) {
      throw participantsError;
    }

    // 4. Inserir a primeira etapa (criação)
    const { error: stageError } = await supabase
      .from('stage_logs')
      .insert({
        batch_id: newBatch.id,
        stage_index: 0,
        added_by_key: brandOwnerPublicKey,
        partner_type: userRole, // O Brand Owner é o ator da criação
        stage_name: 'Lote Criado',
        geolocation: initial_stage_data.geolocation || null, // Exemplo de como pegar dados da etapa
        ipfs_cid: initial_stage_data.ipfs_cid || null,
        transaction_signature: initial_stage_data.transaction_signature || null,
        metadata: initial_stage_data, // Armazenar todos os dados da etapa como metadata
      });

    if (stageError) {
      throw stageError;
    }

    return res.status(201).json({ message: 'Batch created successfully.', batch: newBatch });
  } catch (error: any) {
    console.error('Error creating batch:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

export const getBatchDetails = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { public_key: userPublicKey } = req.user!;

  try {
    const { data: batch, error } = await supabase
      .from('batches')
      .select(`
        *,
        brands (name, logo_url),
        batch_participants (
          partner_public_key,
          users (public_key, name, email, role)
        ),
        stage_logs (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Batch not found.' });
      }
      throw error;
    }

    // Verificar se o usuário tem permissão para ver este lote (RLS já deve lidar com isso, mas é bom ter uma camada extra)
    const isBrandOwner = batch.brand_owner_key === userPublicKey;
    const isCurrentHolder = batch.current_holder_key === userPublicKey;
    const isParticipant = batch.batch_participants.some((bp: any) => bp.partner_public_key === userPublicKey);

    if (!isBrandOwner && !isCurrentHolder && !isParticipant) {
      return res.status(403).json({ error: 'Forbidden: You do not have access to this batch.' });
    }

    return res.status(200).json(batch);
  } catch (error: any) {
    console.error('Error fetching batch details:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

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
        users!batches_current_holder_key_fkey (name, role)
      `);

    if (status) {
      query = query.eq('status', status);
    }

    if (type === 'my-batches' && userRole === 'brand_owner') {
      query = query.eq('brand_owner_key', userPublicKey);
    } else if (type === 'my-tasks' && userRole !== 'brand_owner') {
      query = query.eq('current_holder_key', userPublicKey);
    } else {
      // Se não for um tipo específico, ou se o papel não corresponder, retornar erro ou todos os lotes acessíveis
      // RLS já deve filtrar, mas podemos adicionar uma camada aqui
      query = query.or(`brand_owner_key.eq.${userPublicKey},current_holder_key.eq.${userPublicKey},batch_participants.partner_public_key.eq.${userPublicKey}`);
    }

    const { data: batches, error } = await query;

    if (error) {
      throw error;
    }

    return res.status(200).json(batches);
  } catch (error: any) {
    console.error('Error fetching batches for user:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

export const addStageToBatch = async (req: AuthenticatedRequest, res: Response) => {
  const { id: batchId } = req.params;
  const { stage_name, partner_type, metadata, ipfs_cid, transaction_signature } = req.body;
  const { public_key: userPublicKey, role: userRole } = req.user!;

  try {
    // 1. Verificar se o usuário é o detentor atual do lote
    const { data: batch, error: batchFetchError } = await supabase
      .from('batches')
      .select('id, current_holder_key, onchain_next_stage_index')
      .eq('id', batchId)
      .single();

    if (batchFetchError || !batch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }

    if (batch.current_holder_key !== userPublicKey) {
      return res.status(403).json({ error: 'Forbidden: You are not the current holder of this batch.' });
    }

    // 2. Inserir o novo log de etapa
    const newStageIndex = batch.onchain_next_stage_index + 1;
    const { data: newStage, error: stageError } = await supabase
      .from('stage_logs')
      .insert({
        batch_id: batchId,
        stage_index: newStageIndex,
        added_by_key: userPublicKey,
        partner_type: partner_type || userRole, // Usar o tipo de parceiro fornecido ou o papel do usuário
        stage_name,
        metadata,
        ipfs_cid,
        transaction_signature,
      })
      .select()
      .single();

    if (stageError) {
      throw stageError;
    }

    // 3. Atualizar o onchain_next_stage_index do lote
    const { error: updateBatchError } = await supabase
      .from('batches')
      .update({ onchain_next_stage_index: newStageIndex })
      .eq('id', batchId);

    if (updateBatchError) {
      throw updateBatchError;
    }

    return res.status(201).json({ message: 'Stage added successfully.', stage: newStage });
  } catch (error: any) {
    console.error('Error adding stage to batch:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

export const transferCustody = async (req: AuthenticatedRequest, res: Response) => {
  const { id: batchId } = req.params;
  const { next_holder_public_key } = req.body;
  const { public_key: userPublicKey } = req.user!;

  try {
    // 1. Verificar se o usuário é o detentor atual do lote
    const { data: batch, error: batchFetchError } = await supabase
      .from('batches')
      .select('id, current_holder_key, brand_owner_key, onchain_next_stage_index')
      .eq('id', batchId)
      .single();

    if (batchFetchError || !batch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }

    if (batch.current_holder_key !== userPublicKey) {
      return res.status(403).json({ error: 'Forbidden: You are not the current holder of this batch.' });
    }

    // 2. Verificar se o próximo detentor é um participante válido do lote
    const { data: participant, error: participantError } = await supabase
      .from('batch_participants')
      .select('batch_id')
      .eq('batch_id', batchId)
      .eq('partner_public_key', next_holder_public_key)
      .single();

    if (participantError || !participant) {
      return res.status(400).json({ error: 'Next holder is not a valid participant of this batch.' });
    }

    // 3. Atualizar o detentor atual do lote
    const { data: updatedBatch, error: updateError } = await supabase
      .from('batches')
      .update({ current_holder_key: next_holder_public_key })
      .eq('id', batchId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Opcional: Adicionar um log de etapa para a transferência de custódia
    const { error: stageError } = await supabase
      .from('stage_logs')
      .insert({
        batch_id: batchId,
        stage_index: batch.onchain_next_stage_index + 1, // Incrementa o índice da etapa
        added_by_key: userPublicKey,
        partner_type: 'movement', // Tipo de etapa para transferência
        stage_name: `Custódia Transferida para ${next_holder_public_key}`,
        metadata: { previous_holder: userPublicKey, new_holder: next_holder_public_key },
      });

    if (stageError) {
      console.warn('Could not add stage log for custody transfer:', stageError);
    }

    return res.status(200).json({ message: 'Custody transferred successfully.', batch: updatedBatch });
  } catch (error: any) {
    console.error('Error transferring custody:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

export const finalizeBatch = async (req: AuthenticatedRequest, res: Response) => {
  const { id: batchId } = req.params;
  const { public_key: userPublicKey, role: userRole } = req.user!;

  if (userRole !== 'brand_owner') {
    return res.status(403).json({ error: 'Forbidden: Only Brand Owners can finalize batches.' });
  }

  try {
    // 1. Verificar se o lote pertence ao Brand Owner
    const { data: batch, error: batchFetchError } = await supabase
      .from('batches')
      .select('id, brand_owner_key, onchain_next_stage_index')
      .eq('id', batchId)
      .single();

    if (batchFetchError || !batch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }

    if (batch.brand_owner_key !== userPublicKey) {
      return res.status(403).json({ error: 'Forbidden: This batch does not belong to you.' });
    }

    // 2. Atualizar o status do lote para 'completed'
    const { data: updatedBatch, error: updateError } = await supabase
      .from('batches')
      .update({ status: 'finalized' }) // Usar 'finalized' conforme o enum batch_status
      .eq('id', batchId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Opcional: Adicionar um log de etapa para a finalização
    const { error: stageError } = await supabase
      .from('stage_logs')
      .insert({
        batch_id: batchId,
        stage_index: batch.onchain_next_stage_index + 1,
        added_by_key: userPublicKey,
        partner_type: 'system',
        stage_name: 'Lote Finalizado',
        metadata: { finalized_by: userPublicKey },
      });

    if (stageError) {
      console.warn('Could not add stage log for batch finalization:', stageError);
    }

    return res.status(200).json({ message: 'Batch finalized successfully.', batch: updatedBatch });
  } catch (error: any) {
    console.error('Error finalizing batch:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

export const addParticipantsToBatch = async (req: AuthenticatedRequest, res: Response) => {
  const { id: batchId } = req.params;
  const { new_participant_public_keys } = req.body;
  const { public_key: userPublicKey, role: userRole } = req.user!;

  if (userRole !== 'brand_owner') {
    return res.status(403).json({ error: 'Forbidden: Only Brand Owners can add participants.' });
  }

  try {
    // 1. Verificar se o lote pertence ao Brand Owner
    const { data: batch, error: batchFetchError } = await supabase
      .from('batches')
      .select('id, brand_owner_key')
      .eq('id', batchId)
      .single();

    if (batchFetchError || !batch) {
      return res.status(404).json({ error: 'Batch not found.' });
    }

    if (batch.brand_owner_key !== userPublicKey) {
      return res.status(403).json({ error: 'Forbidden: This batch does not belong to you.' });
    }

    // 2. Obter participantes existentes para evitar duplicatas
    const { data: existingParticipants, error: existingParticipantsError } = await supabase
      .from('batch_participants')
      .select('partner_public_key')
      .eq('batch_id', batchId);

    if (existingParticipantsError) {
      throw existingParticipantsError;
    }

    const existingPublicKeys = new Set(existingParticipants.map(p => p.partner_public_key));
    const participantsToAdd = new_participant_public_keys.filter((pk: string) => !existingPublicKeys.has(pk));

    if (participantsToAdd.length === 0) {
      return res.status(200).json({ message: 'No new participants to add.' });
    }

    // 3. Inserir novos participantes
    const newBatchParticipants = participantsToAdd.map((pk: string) => ({
      batch_id: batchId,
      partner_public_key: pk,
    }));

    const { error: insertError } = await supabase
      .from('batch_participants')
      .insert(newBatchParticipants);

    if (insertError) {
      throw insertError;
    }

    return res.status(200).json({ message: `${participantsToAdd.length} participants added successfully.` });
  } catch (error: any) {
    console.error('Error adding participants to batch:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};