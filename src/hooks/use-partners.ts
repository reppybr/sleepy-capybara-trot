import { PartnerRoleKey } from '@/types/forms'; // Import PartnerRoleKey from new types file
import { roles } from '@/constants/roles'; // Import roles array from new file

export type PartnerRole = typeof roles[number]['value']; // Derive type from roles array

export interface Partner {
  id: string;
  name: string;
  role: PartnerRole; // Use the derived type
  email: string;
  public_key: string;
}

export const usePartners = () => {
  const partners: Partner[] = [
    { id: 'p1', name: 'Café do Sol Ltda.', role: 'producer', email: 'contato@cafedosol.com', public_key: '0xabc...123' },
    { id: 'p2', name: 'Logística Rápida S.A.', role: 'logistics', email: 'info@lograpida.com', public_key: '0xdef...456' },
    { id: 'p3', name: 'Torrefação Aroma Fino', role: 'roaster', email: 'vendas@aromafino.com', public_key: '0xghi...789' },
    { id: 'p4', name: 'Distribuidora Grão Nobre', role: 'distributor', email: 'contato@graonobre.com', public_key: '0xjkl...012' },
    { id: 'p5', name: 'Fazenda Verde Vale', role: 'producer', email: 'contato@verdevale.com', public_key: '0xmnp...345' },
    { id: 'p6', name: 'Armazém Central', role: 'warehouse', email: 'contato@armazemcentral.com', public_key: '0xopq...678' },
  ];
  return { partners, isLoading: false, error: null };
};