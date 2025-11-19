"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
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
  Loader2,
  CheckCircle,
  UserPlus,
  History,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { getBatchById, finalizeBatch } from '@/api/batchService'; // Import API functions
import StageTimeline from '@/components/features/batch/StageTimeline'; // New component
import AddParticipantsModal from '@/components/features/batch/AddParticipantsModal'; // New component
import ParticipantsCard from '@/components/features/batch/ParticipantsCard'; // New component
import StatusBadge from '@/components/batches/StatusBadge'; // Reusing existing StatusBadge

// Helper function for icons (can be moved to utils if reused)
function getFormIcon(partnerType: string) {
  const icons: Record<string, React.ReactNode> = {
    brand_owner: '👑',
    producer: '🌱',
    logistics: '🚚',
    warehouse: '🏭',
    grader: '🔍',
    roaster: '🔥',
    packager: '📦',
    distributor: '🚛',
    end_consumer: '💡',
    sustainability: '🌿',
    beneficiamento: '⚙️',
  };
  return icons[partnerType] || '📝';
}

const BatchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile: user, session } = useSupabaseAuth();

  const [batchData, setBatchData] = useState<any>(null); // Use 'any' for now, define specific type later
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddParticipantsModalOpen, setAddParticipantsModalOpen] = useState(false);

  const refreshBatchData = async () => {
    try {
      const data = await getBatchById(id!);
      setBatchData(data);
    } catch (err: any) {
      console.error('❌ Erro ao recarregar dados do lote:', err);
      toast.error(err.message || 'Erro ao atualizar dados do lote');
    }
  };

  useEffect(() => {
    if (!id) {
      setError("ID do lote não fornecido.");
      setLoading(false);
      return;
    }

    if (!session) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getBatchById(id);
        setBatchData(data);
      } catch (err: any) {
        setError(err.message || 'Lote não encontrado ou falha ao carregar.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, session, navigate]);

  const userPublicKey = user?.public_key;
  const userRole = user?.role;

  const isBatchOwner = userPublicKey === batchData?.details?.brand_owner_key;
  const isCurrentHolder = userPublicKey === batchData?.details?.current_holder_key;
  const isFinalized = batchData?.details?.status === 'completed';

  const canSeeManagement = isBatchOwner;
  const canSeeTimeline = true;
  const canSeeBatchInfo = true;

  const handleFinalize = async () => {
    if (!userPublicKey) {
      toast.error("Você precisa estar conectado.");
      return;
    }

    if (!isBatchOwner) {
      toast.error("Apenas donos de marca podem finalizar lotes.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja finalizar este lote? Esta ação é irreversível.")) {
      return;
    }

    toast.loading("Finalizando lote...", { id: "finalize-batch" });
    try {
      await finalizeBatch(id!, { brandOwnerKey: userPublicKey });
      toast.success("Lote finalizado com sucesso!", { id: "finalize-batch" });
      refreshBatchData();
    } catch (error: any) {
      toast.error(error.message || "Falha ao finalizar o lote.", { id: "finalize-batch" });
      console.error("Error finalizing batch:", error);
    }
  };

  const truncateHash = (hash: string) => {
    if (!hash) return '';
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3">Carregando detalhes do lote...</span>
      </div>
    );
  }

  if (error || !batchData?.details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error || 'Nenhum dado encontrado para este lote.'}</p>
          <Button onClick={() => navigate('/batches')} className="mt-4">
            Voltar para Meus Lotes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-8">
      {/* Header Control Panel */}
      <div className="sticky top-16 z-40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background/80 backdrop-blur-md p-4 -mx-4 sm:-mx-6 lg:-mx-8 shadow-lg rounded-b-lg">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-muted-foreground hover:bg-slate-700">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-mono text-amber-500">{batchData.details.onchain_id}</h1>
          <StatusBadge status={batchData.details.status === 'completed' ? 'FINALIZED' : 'PROCESSING'} className="hidden sm:block" />
        </div>
        <div className="flex flex-wrap gap-2">
          {canSeeManagement && !isFinalized && (
            <Button variant="secondary" onClick={() => setAddParticipantsModalOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" /> Gerenciar Participantes
            </Button>
          )}
          <Button variant="secondary" onClick={() => toast.info("Funcionalidade de QR Code em desenvolvimento.")}>
            <QrCode className="h-4 w-4 mr-2" /> Gerar QR Code Interno
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
              <p className="text-lg font-medium text-primary-foreground">
                {batchData.details.batch_participants?.find((p: any) => p.partner.public_key === batchData.details.current_holder_key)?.partner.name || 'Desconhecido'}
              </p>
              <p className="flex items-center gap-2">
                <Factory className="h-4 w-4 text-slate-500" /> Papel: {batchData.details.batch_participants?.find((p: any) => p.partner.public_key === batchData.details.current_holder_key)?.partner.role || 'N/A'}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" /> Email: {batchData.details.batch_participants?.find((p: any) => p.partner.public_key === batchData.details.current_holder_key)?.partner.email || 'N/A'}
              </p>
              <p className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" /> Desde: {batchData.details.batch_participants?.find((p: any) => p.partner.public_key === batchData.details.current_holder_key)?.joined_at || 'N/A'}
              </p>
              <p className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-slate-500" /> Chave Pública: <span className="font-mono text-sm">{truncateHash(batchData.details.current_holder_key)}</span>
              </p>
            </div>
          </Card>

          {/* Dados Técnicos Card */}
          <Card className="p-6 bg-slate-800/60 backdrop-blur-md">
            <h2 className="text-xl font-semibold text-primary-foreground mb-4 flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-amber-400" /> Dados Técnicos
            </h2>
            <div className="space-y-3 text-muted-foreground">
              <p className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-slate-500" /> Data de Criação: <span className="text-primary-foreground">{new Date(batchData.stages[0]?.timestamp).toLocaleDateString('pt-BR') || 'N/A'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Factory className="h-4 w-4 text-slate-500" /> Produtor: <span className="text-primary-foreground">{batchData.details.producer_name}</span>
              </p>
              <p className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-slate-500" /> Variedade: <span className="text-primary-foreground">{batchData.stages[0]?.formData?.variety || 'N/A'}</span>
              </p>
              <p className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-slate-500" /> Ref. Interna: <span className="font-mono text-primary-foreground">{batchData.stages[0]?.formData?.internalNote || 'N/A'}</span>
              </p>
              <p className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-slate-500" /> Endereço Blockchain: <span className="font-mono text-primary-foreground">{truncateHash(batchData.stages[0]?.hash || 'N/A')}</span>
              </p>
            </div>
          </Card>

          {/* ÁREA DE GESTÃO - APENAS BATCH OWNER */}
          {canSeeManagement && (
            <Card className="p-6 bg-slate-800/60 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-bold text-primary-foreground">Gestão do Lote</h2>
                <span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-1 rounded-full">
                  👑 Dono da Marca
                </span>
              </div>

              <div className="space-y-4">
                {!isFinalized && (
                  <Button
                    onClick={handleFinalize}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar Lote
                  </Button>
                )}

                <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`px-2 py-1 rounded text-sm ${
                    isFinalized ? 'bg-green-900/30 text-green-400' : 'bg-amber-900/30 text-amber-400'
                  }`}>
                    {isFinalized ? 'Finalizado' : 'Ativo'}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Column 2 & 3: Operational Timeline & Work Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline - VISÍVEL PARA TODOS */}
          {canSeeTimeline && (
            <Card className="p-6 bg-slate-800/60 backdrop-blur-md">
              <h2 className="text-xl font-semibold text-primary-foreground mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Log de Eventos e Rastreabilidade
              </h2>
              <StageTimeline stages={batchData.stages || []} />
            </Card>
          )}

          {/* Card de Participantes Expandido - APENAS BATCH OWNER */}
          {canSeeManagement && batchData.details.batch_participants && (
            <ParticipantsCard
              batchId={batchData.details.id}
              participants={batchData.details.batch_participants}
              isOwner={isBatchOwner}
              onParticipantRemoved={refreshBatchData}
              batchData={batchData}
            />
          )}
        </div>
      </div>

      {/* Modal de Adicionar Participantes - APENAS para batch owner */}
      {canSeeManagement && (
        <AddParticipantsModal
          isOpen={isAddParticipantsModalOpen}
          onClose={() => setAddParticipantsModalOpen(false)}
          onSuccess={refreshBatchData}
          batchId={id!}
          currentParticipantIds={batchData.details.batch_participants?.map((p: any) => p.partner.id) || []}
        />
      )}
    </div>
  );
};

export default BatchDetails;