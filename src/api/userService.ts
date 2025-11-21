import apiClient from '@/lib/apiClient';
import { Partner } from '@/hooks/use-partners';

export const assignUserRole = async (data: { identifier: string; method: 'email' | 'publicKey'; role: string }): Promise<{ user: Partner }> => {
  return apiClient<{ user: Partner }>('/user-management/assign-role', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};