import apiClient from '@/lib/apiClient';
import { Partner } from '@/hooks/use-partners';
import { UserProfile } from '@/context/SupabaseAuthContext';

export const assignUserRole = async (data: { identifier: string; method: 'email' | 'publicKey'; role: string }): Promise<{ user: Partner }> => {
  return apiClient<{ user: Partner }>('/user-management/assign-role', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateMyProfile = async (profileData: Partial<Pick<UserProfile, 'name' | 'profile_metadata'>>): Promise<{ user: UserProfile }> => {
  return apiClient<{ user: UserProfile }>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};