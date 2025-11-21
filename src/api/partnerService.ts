import apiClient from '@/lib/apiClient';
import { Partner, PartnerRole } from '@/hooks/use-partners';

export interface ConnectionRequest {
  id: string;
  sender: Partner;
  timestamp: string;
  message?: string;
}

export interface SentRequest {
  id: string;
  recipient: Partner;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
}

export const getMyPartners = async (): Promise<Partner[]> => {
  return apiClient<Partner[]>('/partners/my-network');
};

export const getConnectionRequests = async (type: 'incoming' | 'sent'): Promise<any[]> => {
  return apiClient<any[]>(`/partners/requests?type=${type}`);
};

export const createConnectionRequest = async (data: { recipient_public_key: string; message?: string }): Promise<{ request: SentRequest }> => {
  return apiClient<{ request: SentRequest }>('/partners/requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateConnectionRequestStatus = async ({ id, status }: { id: string; status: 'accepted' | 'rejected' }): Promise<{ request: SentRequest }> => {
  return apiClient<{ request: SentRequest }>(`/partners/requests/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
};