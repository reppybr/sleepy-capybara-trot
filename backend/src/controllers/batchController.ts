import { Request, Response } from 'express';
import { Keypair, PublicKey } from '@solana/web3.js';
import { supabase } from '../config/supabase';
import SolanaService from '../services/SolanaService';
import { decrypt } from '../services/EncryptionService';
import { PartnerRoleKey } from '../../src/types/forms';

// This is a temporary solution. Ideally, a middleware would handle user authentication
// and attach the user object to the request.
interface AuthenticatedRequest extends Request {
  user?: {
    auth_user_id: string;
    public_key: string;
    role: PartnerRoleKey;
    email: string;
    name: string;
  };
}

// Helper function to retrieve and decrypt a user's private key to create a Keypair for signing.
const getUserKeypair = async (authUserId: string): Promise<Keypair> => {
  const { data: user, error } = await supabase
    .from('users')
    .select('encrypted_private_key')
    .eq('auth_user_id', authUserId)
    .single();

  if (error || !user || !user.encrypted_private_key) {
    console.error('Failed to fetch user or their private key:', error);
    throw new Error('User not found or private key is missing.');
  }

  const decryptedSecret = decrypt(user.encrypted_private_key);
  const secretKey = Buffer.from(decryptedSecret, 'base64');
  return Keypair.fromSecretKey(secretKey);
};

export const createBatch = async (req: AuthenticatedRequest, res: Response) => {
  const {
    id: offchain_id,
    brand_id,
    producer_name,
    initialHolderPublicKey,
    participantsPublicKeys,
  } = req.body;
  
  const { auth_user_id, role: userRole } = req.user!;

  if (userRole !== 'brand_owner') {
    return res.status(403).json({ error: 'Forbidden: Only Brand Owners can create batches.' });
  }

  try {
    const brandOwnerKeypair = await getUserKeypair(auth_user_id);
    const batchKeypair = Keypair.generate();
    const onchain_id = batchKeypair.publicKey.toBase58();

    const txSignature = await SolanaService.createBatchOnChain(
      batchKeypair,
      brandOwnerKeypair,
      offchain_id,
      producer_name,
      brand_id,
      new PublicKey(initialHolderPublicKey)
    );
    console.log(`Solana tx successful (createBatch): ${txSignature}`);

    const { data: newBatch, error: batchError } = await supabase
      .from('batches')
      .insert({
        id: offchain_id,
        onchain_id: onchain_id,
        brand_id,
        producer_name,
        current_holder_key: initialHolderPublicKey,
        brand_owner_key: brandOwnerKeypair.publicKey.toBase58(),
        status: 'processing',
      })
      .select()
      .single();

    if (batchError) throw batchError;

    const batchParticipants = participantsPublicKeys.map((pk: string) => ({
      batch_id: newBatch.id,
      partner_public_key: pk,
    }));
    const { error: participantsError } = await supabase
      .from('batch_participants')
      .insert(batchParticipants);

    if (participantsError) throw participantsError;

    const { error: stageError } = await supabase.from('stage_logs').insert({
      batch_id: newBatch.id,
      stage_index: 0,
      added_by_key: brandOwnerKeypair.publicKey.toBase58(),
      partner_type: 'brand_owner',
      stage_name: 'Lote Criado',
      transaction_signature: txSignature,
      metadata: { offchain_id, producer_name, brand_id },
    });

    if (stageError) throw stageError;

    return res.status(201).json({ message: 'Batch created successfully.', batch: newBatch });
  } catch (error: any) {
    console.error('Error creating batch:', error);
    return res.status(500).json({ error: 'Internal server error.', details: error.message });
  }
};

export const addStageToBatch = async (req: AuthenticatedRequest, res: Response) => {
    const { id: batchId } = req.params;
    const { stage_name, partner_type, metadata, ipfs_cid } = req.body;
    const { auth_user_id } = req.user!;

    try {
        const { data: batch, error: batchFetchError } = await supabase
            .from('batches')
            .select('onchain_id, current_holder_key, onchain_next_stage_index')
            .eq('id', batchId)
            .single();

        if (batchFetchError || !batch) return res.status(404).json({ error: 'Batch not found.' });

        const currentHolderKeypair = await getUserKeypair(auth_user_id);
        if (currentHolderKeypair.publicKey.toBase58() !== batch.current_holder_key) {
            return res.status(403).json({ error: 'Forbidden: You are not the current holder.' });
        }

        const txSignature = await SolanaService.addStageOnChain(
            new PublicKey(batch.onchain_id),
            currentHolderKeypair,
            stage_name,
            ipfs_cid || '',
            partner_type
        );
        console.log(`Solana tx successful (addStage): ${txSignature}`);

        const newStageIndex = (batch.onchain_next_stage_index || 0) + 1;
        const { data: newStage, error: stageError } = await supabase
            .from('stage_logs')
            .insert({
                batch_id: batchId,
                stage_index: newStageIndex,
                added_by_key: currentHolderKeypair.publicKey.toBase58(),
                partner_type, stage_name, metadata, ipfs_cid,
                transaction_signature: txSignature,
            })
            .select().single();

        if (stageError) throw stageError;

        const { error: updateBatchError } = await supabase
            .from('batches')
            .update({ onchain_next_stage_index: newStageIndex })
            .eq('id', batchId);

        if (updateBatchError) throw updateBatchError;

        return res.status(201).json({ message: 'Stage added successfully.', stage: newStage });
    } catch (error: any) {
        console.error('Error adding stage:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
};

export const transferCustody = async (req: AuthenticatedRequest, res: Response) => {
    const { id: batchId } = req.params;
    const { next_holder_public_key } = req.body;
    const { auth_user_id } = req.user!;

    try {
        const { data: batch, error: batchFetchError } = await supabase
            .from('batches').select('onchain_id, current_holder_key').eq('id', batchId).single();

        if (batchFetchError || !batch) return res.status(404).json({ error: 'Batch not found.' });

        const currentHolderKeypair = await getUserKeypair(auth_user_id);
        if (currentHolderKeypair.publicKey.toBase58() !== batch.current_holder_key) {
            return res.status(403).json({ error: 'Forbidden: You are not the current holder.' });
        }

        const txSignature = await SolanaService.transferCustodyOnChain(
            new PublicKey(batch.onchain_id),
            currentHolderKeypair,
            new PublicKey(next_holder_public_key)
        );
        console.log(`Solana tx successful (transferCustody): ${txSignature}`);

        const { data: updatedBatch, error: updateError } = await supabase
            .from('batches')
            .update({ current_holder_key: next_holder_public_key })
            .eq('id', batchId)
            .select().single();

        if (updateError) throw updateError;

        return res.status(200).json({ message: 'Custody transferred successfully.', batch: updatedBatch });
    } catch (error: any) {
        console.error('Error transferring custody:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
};

export const finalizeBatch = async (req: AuthenticatedRequest, res: Response) => {
    const { id: batchId } = req.params;
    const { auth_user_id, role: userRole } = req.user!;

    if (userRole !== 'brand_owner') {
        return res.status(403).json({ error: 'Forbidden: Only Brand Owners can finalize.' });
    }

    try {
        const { data: batch, error: batchFetchError } = await supabase
            .from('batches').select('onchain_id, brand_owner_key').eq('id', batchId).single();

        if (batchFetchError || !batch) return res.status(404).json({ error: 'Batch not found.' });

        const brandOwnerKeypair = await getUserKeypair(auth_user_id);
        if (brandOwnerKeypair.publicKey.toBase58() !== batch.brand_owner_key) {
            return res.status(403).json({ error: 'Forbidden: You are not the brand owner.' });
        }

        const txSignature = await SolanaService.finalizeBatchOnChain(
            new PublicKey(batch.onchain_id),
            brandOwnerKeypair
        );
        console.log(`Solana tx successful (finalizeBatch): ${txSignature}`);

        const { data: updatedBatch, error: updateError } = await supabase
            .from('batches').update({ status: 'finalized' }).eq('id', batchId).select().single();

        if (updateError) throw updateError;

        return res.status(200).json({ message: 'Batch finalized successfully.', batch: updatedBatch });
    } catch (error: any) {
        console.error('Error finalizing batch:', error);
        return res.status(500).json({ error: 'Internal server error.', details: error.message });
    }
};

// Re-export read-only functions from the other file
export { getBatchDetails, getBatchesForUser, addParticipantsToBatch } from './_batchController_reads';