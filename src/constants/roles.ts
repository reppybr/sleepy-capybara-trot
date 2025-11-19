import { FieldOption } from '@/types/forms';

export const roles: FieldOption[] = [
  { value: 'producer', label: '🌱 Produtor' },
  { value: 'logistics', label: '🚚 Logística' },
  { value: 'warehouse', label: '🏭 Armazém' },
  { value: 'grader', label: '🔍 Classificador' },
  { value: 'roaster', label: '🔥 Torrefador' },
  { value: 'packager', label: '📦 Embalador' },
  { value: 'distributor', label: '🚛 Distribuidor' },
  { value: 'end_consumer', label: '💡 Consumidor Final / Barista' },
  { value: 'sustainability', label: '🌿 Sustentabilidade' },
  { value: 'beneficiamento', label: '⚙️ Beneficiamento' }
];