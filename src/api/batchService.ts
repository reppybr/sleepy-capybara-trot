import apiClient from '@/lib/apiClient';
import { Partner } from '@/hooks/use-partners';

// Basic type for a batch list item
export interface Batch {
  id: string;
  onchain_id: string;
  producer_name: string;
  current_holder_key: string;
  status: string;
  created_at: string;
  users: { name: string; role: string };
  variety?: string; // Making variety optional as it might not be in all list views
}

// More detailed type for a single batch view
export interface BatchDetails extends Batch {
  stages: any[];
  batch_participants: { partner: Partner }[];
  brand_owner_key: string;
}

export const getBatches = async (type: 'my-batches' | 'my-tasks'): Promise<Batch[]> => {
  return apiClient<Batch[]>(`/batches?type=${type}`);
};

export const getBatchById = async (id: string): Promise<BatchDetails> => {
  return apiClient<BatchDetails>(`/batches/${id}`);
};

export const createBatch = async (batchData: any): Promise<{ batch: BatchDetails }> => {
  return apiClient<{ batch: BatchDetails }>('/batches', {
    method: 'POST',
    body: JSON.stringify(batchData),
  });
};

export const addParticipantsToBatch = async (batchId: string, new_participant_public_keys: string[]): Promise<{ message: string }> => {
  return apiClient<{ message: string }>(`/batches/${batchId}/participants`, {
    method: 'POST',
    body: JSON.stringify({ new_participant_public_keys }),
  });
};

export const registerStage = async (batchId: string, stageData: any): Promise<{ stage: any }> => {
  return apiClient<{ stage: any }>(`/batches/${batchId}/stages`, {
    method: 'POST',
    body: JSON.stringify(stageData),
  });
};

export const transferCustody = async (batchId: string, next_holder_public_key: string): Promise<{ batch: Batch }> => {
  return apiClient<{ batch: Batch }>(`/batches/${batchId}/transfer-custody`, {
    method: 'PUT',
    body: JSON.stringify({ next_holder_public_key }),
  });
};

export const finalizeBatch = async (batchId: string): Promise<{ batch: Batch }> => {
  return apiClient<{ batch: Batch }>(`/batches/${batchId}/finalize`, {
    method: 'PUT',
  });
};