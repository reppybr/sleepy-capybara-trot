import { useQuery } from '@tanstack/react-query';
import { getMyPartners } from '@/api/partnerService';
import { PartnerRoleKey } from '@/types/forms';
import { roles } from '@/constants/roles';

export type PartnerRole = typeof roles[number]['value'];

export interface Partner {
  id: string;
  name: string;
  role: PartnerRole;
  email: string;
  public_key: string;
}

export const usePartners = () => {
  const { data: partners = [], isLoading, error, refetch } = useQuery<Partner[]>({
    queryKey: ['partners'],
    queryFn: getMyPartners,
  });

  return { partners, isLoading, error, refetch };
};