"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import {
  ArrowLeft,
  Loader2,
  Factory,
  Package,
  CheckCircle,
  Send,
  History, // Added History icon for the sidebar title
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { getBatchById } from '@/api/batchService';
import { DynamicStageForm } from '@/components/features/batch/DynamicStageForm';
import { TransferCustodyForm } from '@/components/features/batch/TransferCustodyForm';
import StageTimeline from '@/components/features/batch/StageTimeline'; // Using StageTimeline for the sidebar
import StatusBadge from '@/components/batches/StatusBadge';
import { PartnerRoleKey } from '@/types/forms'; // Import PartnerRoleKey from new types file

const RegisterStage: React.FC = () => {
  const { id: batchId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [batchData, setBatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stageRegistered, setStageRegistered] = useState(false);
  const [currentHolderRoleKey, setCurrentHolderRoleKey] = useState<PartnerRoleKey | undefined>(undefined);

  const refreshBatchData = async () => {
    try {
      const data = await getBatchById(batchId!);
      setBatchData(data);
      const currentHolderPartner = data.details.batch_participants?.find((p: any) => p.partner.public_key === data.details.current_holder_key)?.partner;
      setCurrentHolderRoleKey(currentHolderPartner?.role as PartnerRoleKey);

      if (user?.public_key !== data.details.current_holder_key) {
        setStageRegistered(true);
      } else {
        setStageRegistered(false);
      }
    } catch (err: any) {
      console.error('❌ Erro ao recarregar dados do lote:', err);
      toast.error(err.message || 'Erro ao atualizar dados do lote');
    }
  };

  useEffect(() => {
    if (!batchId) {
      setError("ID do lote não fornecido.");
      setLoading(false);
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getBatchById(batchId);
        setBatchData(data);
        const currentHolderPartner = data.details.batch_participants?.find((p: any) => p.partner.public_key === data.details.current_holder_key)?.partner;
        setCurrentHolderRoleKey(currentHolderPartner?.role as PartnerRoleKey);

        if (user?.public_key !== data.details.current_holder_key) {
          setStageRegistered(true);
        } else {
          setStageRegistered(false);
        }
      } catch (err: any) {
        setError(err.message || 'Lote não encontrado ou falha ao carregar.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [batchId, isAuthenticated, navigate, user?.public_key]);

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
          <Button onClick={() => navigate('/tasks')} className="mt-4">
            Voltar para Minhas Tarefas
          </Button>
        </div>
      </div>
    );
  }

  const isCurrentHolder = user?.public_key === batchData.details.current_holder_key;
  const isFinalized = batchData.details.status === 'completed';

  const handleStageAdded = () => {
    setStageRegistered(true);
    refreshBatchData();
    toast.success("Etapa registrada! Agora transfira a custódia.");
  };

  const handleTransferSuccess = () => {
    toast.success("Custódia transferida com sucesso!");
    navigate('/dashboard');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
      {/* Main Content Area (2/3 width on large screens) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Context Header Card */}
        <Card className="p-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-muted-foreground hover:bg-slate-700">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-mono text-amber-500">{batchData.details.onchain_id}</h1>
                <p className="text-md text-muted-foreground flex items-center gap-2 mt-1">
                  <Factory className="h-4 w-4" /> {batchData.details.producer_name}
                </p>
              </div>
            </div>
            <StatusBadge status={batchData.details.status === 'completed' ? 'FINALIZED' : 'PROCESSING'} />
          </div>
        </Card>

        {/* Dynamic Action Form */}
        {!isFinalized && isCurrentHolder && !stageRegistered && currentHolderRoleKey && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary-foreground">Registro de Atividade</h2>
            <p className="text-muted-foreground">Preencha os dados técnicos desta etapa para validar o bloco.</p>
            <DynamicStageForm
              batchId={batchId!}
              onStageAdded={handleStageAdded}
              partnerType={currentHolderRoleKey} // Use the specific role of the current holder
            />
          </div>
        )}

        {/* Custody Transfer Section */}
        {!isFinalized && isCurrentHolder && stageRegistered && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary-foreground">Transferência de Responsabilidade (Handoff)</h2>
            <p className="text-muted-foreground">Selecione para quem você está entregando este lote fisicamente.</p>
            <TransferCustodyForm
              batch={batchData}
              currentHolderKey={user?.public_key || ''}
              onTransferSuccess={handleTransferSuccess}
            />
          </div>
        )}

        {/* Message if not current holder or finalized */}
        {(!isCurrentHolder || isFinalized) && !stageRegistered && (
          <Card className="p-8 text-center bg-slate-800/60 backdrop-blur-md border border-slate-700">
            <History className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-primary-foreground mb-2">
              {isFinalized ? 'Lote Finalizado' : 'Aguardando Sua Etapa'}
            </h3>
            <p className="text-muted-foreground">
              {isFinalized
                ? 'Este lote foi finalizado e não aceita novas etapas.'
                : `Este lote não está mais sob sua custódia ou ainda não chegou à sua etapa de trabalho como ${user?.role}.`
              }
            </p>
            <Button onClick={() => navigate('/tasks')} className="mt-4">
              Voltar para Minhas Tarefas
            </Button>
          </Card>
        )}

        {/* Message if stage is registered but not yet transferred */}
        {!isFinalized && isCurrentHolder && stageRegistered && (
          <Card className="p-8 text-center bg-slate-800/60 backdrop-blur-md border border-slate-700">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-primary-foreground mb-2">
              Etapa Registrada!
            </h3>
            <p className="text-muted-foreground">
              Agora, por favor, transfira a custódia do lote para o próximo participante.
            </p>
          </Card>
        )}
      </div>

      {/* Right Sidebar: History (1/3 width on large screens) */}
      <div className="lg:col-span-1 sticky top-5 h-fit space-y-6 p-6 bg-slate-800/60 backdrop-blur-md border border-slate-700 rounded-lg">
        <h2 className="text-xl font-bold text-primary-foreground mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-primary" /> Histórico do Lote
        </h2>
        <StageTimeline
          stages={batchData.stages || []}
          userPublicKey={user?.public_key || ''}
          filterStatus={['completed', 'active']} // Filter to show only completed or active stages
        />
      </div>
    </div>
  );
};

export default RegisterStage;