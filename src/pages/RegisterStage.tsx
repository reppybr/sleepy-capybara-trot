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
  History,
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { getBatchById } from '@/api/batchService';
import { DynamicStageForm } from '@/components/features/batch/DynamicStageForm';
import { TransferCustodyForm } from '@/components/features/batch/TransferCustodyForm';
import MiniTimelineStepper from '@/components/features/batch/MiniTimelineStepper'; // New component
import StatusBadge from '@/components/batches/StatusBadge'; // Reusing existing StatusBadge

const RegisterStage: React.FC = () => {
  const { id: batchId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [batchData, setBatchData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stageRegistered, setStageRegistered] = useState(false); // State to control form flow

  const refreshBatchData = async () => {
    try {
      const data = await getBatchById(batchId!);
      setBatchData(data);
      // After refreshing, check if the user is still the current holder
      if (user?.public_key !== data.details.current_holder_key) {
        setStageRegistered(true); // If custody was transferred, mark stage as registered
      } else {
        setStageRegistered(false); // If still current holder, allow stage registration
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
        if (user?.public_key !== data.details.current_holder_key) {
          // If user is not the current holder, they might have already transferred custody
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
    navigate('/dashboard'); // Redirect to dashboard after successful transfer
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      {/* Context Header */}
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

        {/* Mini Timeline */}
        <MiniTimelineStepper
          batchParticipants={batchData.details.batch_participants}
          currentHolderKey={batchData.details.current_holder_key}
          userPublicKey={user?.public_key || ''}
          stages={batchData.stages}
        />
      </Card>

      {/* Dynamic Action Form */}
      {!isFinalized && isCurrentHolder && !stageRegistered && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary-foreground">Registro de Atividade</h2>
          <p className="text-muted-foreground">Preencha os dados técnicos desta etapa para validar o bloco.</p>
          <DynamicStageForm
            batchId={batchId!}
            onStageAdded={handleStageAdded}
            partnerType={user?.role || 'employee_partner'} // Assuming employee_partner for workers
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
  );
};

export default RegisterStage;