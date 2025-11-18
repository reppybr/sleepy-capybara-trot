// src/api/batchService.ts
import { Partner } from '@/hooks/use-partners';
import { toast } from 'sonner';

// Mock data for partners (should ideally come from a central source like usePartners)
const mockPartners: Partner[] = [
  { id: 'p1', name: 'Café do Sol Ltda.', role: 'producer', email: 'contato@cafedosol.com', public_key: '0xabc...123' },
  { id: 'p2', name: 'Logística Rápida S.A.', role: 'logistics', email: 'info@lograpida.com', public_key: '0xdef...456' },
  { id: 'p3', name: 'Torrefação Aroma Fino', role: 'roaster', email: 'vendas@aromafino.com', public_key: '0xghi...789' },
  { id: 'p4', name: 'Distribuidora Grão Nobre', role: 'distributor', email: 'contato@graonobre.com', public_key: '0xjkl...012' },
  { id: 'p5', name: 'Fazenda Verde Vale', role: 'producer', email: 'contato@verdevale.com', public_key: '0xmnp...345' },
  { id: 'p6', name: 'Armazém Central', role: 'warehouse', email: 'contato@armazemcentral.com', public_key: '0xopq...678' },
  { id: 'p7', name: 'João Silva', role: 'brand_owner', email: 'joao.silva@coffeledger.com', public_key: '0xbrandownerkey123' }, // Mock Brand Owner
  { id: 'p8', name: 'TransCafé Express', role: 'logistics', email: 'ops@transcafe.com.br', public_key: 'WORKER-WALLET-456' }, // Mock Logistics Partner
];

// Mock Batch Data Store
let mockBatchesData: any[] = [
  {
    details: {
      id: 'BTC-2024-093',
      onchain_id: 'BTC-2024-093',
      producer_name: 'Fazenda União',
      variety: 'Arábica Blend',
      internal_note: 'Ref: Talhão 5, Safra 2024',
      brand_owner_key: '0xbrandownerkey123',
      current_holder_key: '0xbrandownerkey123', // Currently with Brand Owner
      status: 'processing',
      batch_participants: [
        { id: 'bp1', partner: mockPartners.find(p => p.public_key === '0xbrandownerkey123'), joined_at: '2024-11-18T10:00:00Z' },
        { id: 'bp2', partner: mockPartners.find(p => p.id === 'p1'), joined_at: '2024-11-18T10:00:00Z' }, // Producer
        { id: 'bp3', partner: mockPartners.find(p => p.id === 'p2'), joined_at: '2024-11-18T10:00:00Z' }, // Logistics
        { id: 'bp4', partner: mockPartners.find(p => p.id === 'p3'), joined_at: '2024-11-18T10:00:00Z' }, // Roaster
      ].filter(bp => bp.partner), // Filter out any undefined partners
    },
    stages: [
      {
        id: 'stage-001',
        type: 'creation',
        title: 'Lote Criado',
        actor: 'João Silva',
        actor_public_key: '0xbrandownerkey123',
        timestamp: '2024-11-18T10:00:00Z',
        hash: '0xabc123def456ghi789jkl012mno345pqr678stu901vwx234yz567',
        formData: {
          producerName: 'Fazenda União',
          variety: 'Arábica Blend',
          internalNote: 'Ref: Talhão 5, Safra 2024',
        },
        status: 'completed',
      },
    ],
  },
  {
    details: {
      id: 'FSC-25-9X7K',
      onchain_id: 'FSC-25-9X7K',
      producer_name: 'Fazenda Santa Clara',
      variety: 'Geisha Premium',
      internal_note: 'Lote especial para exportação',
      brand_owner_key: '0xbrandownerkey123',
      current_holder_key: 'WORKER-WALLET-456', // Currently with Logistics Partner
      status: 'processing',
      batch_participants: [
        { id: 'bp5', partner: mockPartners.find(p => p.public_key === '0xbrandownerkey123'), joined_at: '2025-11-17T09:00:00Z' },
        { id: 'bp6', partner: mockPartners.find(p => p.id === 'p5'), joined_at: '2025-11-17T09:00:00Z' }, // Producer
        { id: 'bp7', partner: mockPartners.find(p => p.public_key === 'WORKER-WALLET-456'), joined_at: '2025-11-18T08:00:00Z' }, // Logistics
        { id: 'bp8', partner: mockPartners.find(p => p.id === 'p6'), joined_at: '2025-11-18T08:00:00Z' }, // Warehouse
      ].filter(bp => bp.partner),
    },
    stages: [
      {
        id: 'stage-002',
        type: 'creation',
        title: 'Lote Criado',
        actor: 'João Silva',
        actor_public_key: '0xbrandownerkey123',
        timestamp: '2025-11-17T09:00:00Z',
        hash: '0xdef456ghi789jkl012mno345pqr678stu901vwx234yz567abc1',
        formData: {
          producerName: 'Fazenda Santa Clara',
          variety: 'Geisha Premium',
          internalNote: 'Lote especial para exportação',
        },
        status: 'completed',
      },
      {
        id: 'stage-003',
        type: 'movement',
        title: 'Coleta Realizada',
        actor: 'Fazenda Santa Clara',
        actor_public_key: mockPartners.find(p => p.id === 'p5')?.public_key,
        timestamp: '2025-11-18T08:00:00Z',
        hash: '0x123abc456def789ghi012jkl345mno678pqr901stu234vwx567yz',
        formData: {
          collectionDate: '2025-11-18',
          vehiclePlate: 'ABC-1234',
        },
        status: 'completed',
      },
    ],
  },
  // Add more mock batches as needed
];

export const getBatchById = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  const batch = mockBatchesData.find(b => b.details.id === id);
  if (!batch) {
    throw new Error(`Lote com ID ${id} não encontrado.`);
  }
  return JSON.parse(JSON.stringify(batch)); // Return a deep copy to prevent direct mutation
};

export const finalizeBatch = async (batchId: string, data: { brandOwnerKey: string }) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const batchIndex = mockBatchesData.findIndex(b => b.details.id === batchId);
  if (batchIndex === -1) {
    throw new Error(`Lote com ID ${batchId} não encontrado.`);
  }
  if (mockBatchesData[batchIndex].details.brand_owner_key !== data.brandOwnerKey) {
    throw new Error("Apenas o dono da marca pode finalizar o lote.");
  }
  mockBatchesData[batchIndex].details.status = 'completed';
  mockBatchesData[batchIndex].stages.push({
    id: `stage-${Date.now()}`,
    type: 'system',
    title: 'Lote Finalizado',
    actor: 'Sistema',
    actor_public_key: data.brandOwnerKey,
    timestamp: new Date().toISOString(),
    hash: `0x${Math.random().toString(16).substring(2, 66)}`, // Mock hash
    status: 'completed',
  });
  return { success: true, message: `Lote ${batchId} finalizado.` };
};

export const addParticipantsToBatch = async (batchId: string, newParticipantPublicKeys: string[]) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const batchIndex = mockBatchesData.findIndex(b => b.details.id === batchId);
  if (batchIndex === -1) {
    throw new Error(`Lote com ID ${batchId} não encontrado.`);
  }

  const currentParticipantPublicKeys = mockBatchesData[batchIndex].details.batch_participants.map((p: any) => p.partner.public_key);
  const participantsToAdd = mockPartners.filter(p =>
    newParticipantPublicKeys.includes(p.public_key) && !currentParticipantPublicKeys.includes(p.public_key)
  );

  participantsToAdd.forEach(newPartner => {
    mockBatchesData[batchIndex].details.batch_participants.push({
      id: `bp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      partner: newPartner,
      joined_at: new Date().toISOString(),
    });
  });

  return { success: true, message: `${participantsToAdd.length} novos participantes adicionados.` };
};

export const registerStage = async (batchId: string, stageData: any, actorPublicKey: string, actorName: string, stageType: string, stageTitle: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const batchIndex = mockBatchesData.findIndex(b => b.details.id === batchId);
  if (batchIndex === -1) {
    throw new Error(`Lote com ID ${batchId} não encontrado.`);
  }

  // Simulate blockchain transaction hash
  const transactionHash = `0x${Math.random().toString(16).substring(2, 66)}`;

  mockBatchesData[batchIndex].stages.push({
    id: `stage-${Date.now()}`,
    type: stageType,
    title: stageTitle,
    actor: actorName,
    actor_public_key: actorPublicKey,
    timestamp: new Date().toISOString(),
    hash: transactionHash,
    formData: stageData,
    status: 'completed', // Mark as completed once registered
  });

  return { success: true, message: `Etapa '${stageTitle}' registrada com sucesso!`, transactionHash };
};

export const transferCustody = async (batchId: string, currentHolderPublicKey: string, nextHolderPublicKey: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const batchIndex = mockBatchesData.findIndex(b => b.details.id === batchId);
  if (batchIndex === -1) {
    throw new Error(`Lote com ID ${batchId} não encontrado.`);
  }

  if (mockBatchesData[batchIndex].details.current_holder_key !== currentHolderPublicKey) {
    throw new Error("Você não é o detentor atual deste lote para transferir a custódia.");
  }

  const nextHolder = mockPartners.find(p => p.public_key === nextHolderPublicKey);
  if (!nextHolder) {
    throw new Error("Próximo detentor não encontrado.");
  }

  mockBatchesData[batchIndex].details.current_holder_key = nextHolderPublicKey;
  mockBatchesData[batchIndex].stages.push({
    id: `stage-${Date.now()}`,
    type: 'movement',
    title: `Custódia Transferida para ${nextHolder.name}`,
    actor: nextHolder.name,
    actor_public_key: nextHolderPublicKey,
    timestamp: new Date().toISOString(),
    hash: `0x${Math.random().toString(16).substring(2, 66)}`, // Mock hash
    status: 'completed',
  });

  return { success: true, message: `Custódia do lote ${batchId} transferida para ${nextHolder.name}.` };
};