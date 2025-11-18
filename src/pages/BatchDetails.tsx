import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import StatusBadge from '@/components/batches/StatusBadge';
import Timeline, { TimelineEvent } from '@/components/batches/Timeline';
import {
  QrCode,
  Edit,
  Truck,
  ClipboardCheck,
  Factory,
  MapPin,
  Clock,
  User,
  Mail,
  Hash,
  CalendarDays,
  Coffee,
  Link as LinkIcon,
  ArrowLeft,
  Package,
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for a single batch
const mockBatchDetails = {
  id: "FSC-25-9X7K",
  variety: "Catuaí Amarelo",
  producerName: "Fazenda Santa Clara",
  internalRefCode: "REF-SC-2025-001",
  creationDate: "15/11/2025 10:00",
  blockchainAddress: "0x1c3b7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c",
  current_status: "IN_TRANSIT" as const, // Use 'as const' for literal type
  current_custody: {
    name: "Logística TransCafé Ltda",
    role: "Transportadora",
    email: "ops@transcafe.com.br",
    since: "18/11/2025 08:30",
    publicKey: "0xdef...456",
  },
  timeline: [
    { id: 3, type: "movement", title: "Saída para Entrega", actor: "Logística TransCafé", timestamp: "18/11/2025 14:00", hash: "0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0987654321098765432109876543", status: "active" },
    { id: 2, type: "verification", title: "Check-in no Armazém", actor: "Armazéns Gerais", timestamp: "17/11/2025 09:15", hash: "0x7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b", status: "completed" },
    { id: 1, type: "creation", title: "Lote Criado (Origem)", actor: "Fazenda Santa Clara", timestamp: "15/11/2025 10:00", hash: "0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d", status: "completed" },
    { id: 0, type: "predicted", title: "Entrega Final (Previsão)", actor: "Distribuidor Final", timestamp: "20/11/2025 10:00", status: "predicted" }, // Example of a predicted event
  ] as TimelineEvent[],
};

const BatchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // In a real application, you would fetch batch details based on 'id'
  const batch = mockBatchDetails; // Using mock data for now

  if (!batch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">Lote não encontrado.</p>
      </div>
    );
  }

  const handleAction = (action: string) => {
    toast.info(`Ação: ${action} para o lote ${batch.id}`);
    // Implement specific logic for each action
  };

  const truncateHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  return (
    <div className="space-y-8 py-8">
      {/* Header Control Panel */}
      <div className="sticky top-16 z-40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background/80 backdrop-blur-md p-4 -mx-4 sm:-mx-6 lg:-mx-8 shadow-lg rounded-b-lg">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-muted-foreground hover:bg-slate-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-mono text-amber-500">{batch.id}</h1>
          <StatusBadge status={batch.current_status} className="hidden sm:block" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => handleAction("Registrar Evento")}>
            Registrar Evento
          </Button>
          <Button variant="secondary" onClick={() => handleAction("Gerar QR Code Interno")}>
            <QrCode className="h-4 w-4 mr-2" /> Gerar QR Code Interno
          </Button>
          <Button variant="secondary" onClick={() => handleAction("Editar Dados")}>
            <Edit className="h-4 w-4 mr-2" /> Editar Dados
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Column 1: Custody & Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Custódia Atual Card */}
          <Card className="p-6 border-l-4 border-blue-500 bg-slate-800/60 backdrop-blur-md">
            <h2 className="text-xl font-semibold text-primary-foreground mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" /> Custódia Atual (Responsável)
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="text-lg font-medium text-primary-foreground">{batch.current_custody.name}</p>
              <p className="flex items-center gap-2">
                <Factory className="h-4 w-4 text-slate-500" /> Papel: {batch.current_custody.role}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" /> Email: {batch.current_custody.email}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" /> Desde: {batch.current_custody.since}
              </p>
              <p className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-slate-500" /> Chave Pública: <span className="font-mono text-sm">{truncateHash(batch.current_custody.publicKey)}</span>
              </p>
            </div>
            <Button variant="primary" className="w-full mt-6" onClick={() => handleAction("Solicitar Transferência")}>
              <Truck className="h-4 w-4 mr-2" /> Solicitar Transferência
            </Button>
          </Card>

          {/* Dados Técnicos Card */}
          <Card className="p-6 bg-slate-800/60 backdrop-blur-md">
            <h2 className="text-xl font-semibold text-primary-foreground mb-4 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-amber-400" /> Dados Técnicos
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-500" /> Data de Criação: <span className="text-primary-foreground">{batch.creationDate}</span>
              </p>
              <p className="flex items-center gap-2">
                <Factory className="h-4 w-4 text-slate-500" /> Produtor: <span className="text-primary-foreground">{batch.producerName}</span>
              </p>
              <p className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-slate-500" /> Variedade: <span className="text-primary-foreground">{batch.variety}</span>
              </p>
              <p className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-slate-500" /> Ref. Interna: <span className="font-mono text-primary-foreground">{batch.internalRefCode}</span>
              </p>
              <p className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-slate-500" /> Endereço Blockchain: <span className="font-mono text-primary-foreground">{truncateHash(batch.blockchainAddress)}</span>
              </p>
            </div>
          </Card>
        </div>

        {/* Column 2 & 3: Operational Timeline */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-slate-800/60 backdrop-blur-md">
            <h2 className="text-xl font-semibold text-primary-foreground mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Log de Eventos e Rastreabilidade
            </h2>
            <Timeline events={batch.timeline} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BatchDetails;