import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonCard from "@/components/common/Card";
import Button from '@/components/common/Button';
import KpiCard from '@/components/dashboard/KpiCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, CheckCircle, Layers, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { getBatches } from '@/api/batchService';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let variantClasses = "";
  let label = "Desconhecido";

  switch (status) {
    case "finalized":
      variantClasses = "bg-emerald-500/20 text-emerald-400 border-emerald-500/20";
      label = "Finalizado";
      break;
    case "processing":
      variantClasses = "bg-blue-500/20 text-blue-400 border-blue-500/20";
      label = "Em Processamento";
      break;
    default:
      variantClasses = "bg-muted/20 text-muted-foreground border-muted/20";
  }
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold border", variantClasses)}>
      {label}
    </span>
  );
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useSupabaseAuth();

  const { data: batches = [], isLoading: isLoadingBatches } = useQuery({
    queryKey: ['batches', 'my-batches'],
    queryFn: () => getBatches('my-batches'),
    enabled: !!profile, // Only fetch if the user profile is loaded
  });

  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['batches', 'my-tasks'],
    queryFn: () => getBatches('my-tasks'),
    enabled: !!profile,
  });

  const kpiData = React.useMemo(() => {
    const processingBatches = batches.filter(b => b.status === 'processing').length;
    const finalizedBatches = batches.filter(b => b.status === 'finalized').length;
    const pendingTasks = tasks.length;

    return [
      { id: "kpi-1", label: "Lotes em Produção", value: processingBatches.toString(), trend: "Ativos na cadeia", trendPositive: true, icon: Package, color: "border-blue-500", textColor: "text-blue-400" },
      { id: "kpi-2", label: "Lotes Finalizados", value: finalizedBatches.toString(), trend: "Total de lotes concluídos", trendPositive: true, icon: CheckCircle, color: "border-emerald-500", textColor: "text-emerald-400" },
      { id: "kpi-3", label: "Total de Lotes", value: batches.length.toString(), trend: "Registrados por você", icon: Layers, color: "border-amber-500", textColor: "text-amber-500" },
      { id: "kpi-4", label: "Ações Pendentes", value: pendingTasks.toString(), trend: "Tarefas aguardando sua ação", trendUrgency: pendingTasks > 0, icon: AlertTriangle, color: "border-red-500", textColor: "text-red-400" },
    ];
  }, [batches, tasks]);

  const recentBatches = batches.slice(0, 4);

  const handleRowClick = (batchId: string) => {
    navigate(`/batches/${batchId}`);
  };

  const isLoading = isLoadingBatches || isLoadingTasks;

  return (
    <div className="space-y-10 py-8">
      <div>
        <h1 className="text-4xl font-bold text-primary-foreground">Visão Geral</h1>
        <p className="text-lg text-muted-foreground mt-1">Bem-vindo de volta. Aqui está o resumo da sua produção de café.</p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-primary-foreground mb-6">Performance Operacional</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <CommonCard key={i} className="h-36 animate-pulse bg-slate-800/60" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi) => (
              <KpiCard key={kpi.id} {...kpi} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-primary-foreground">Lotes Recentes</h2>
          <Button variant="ghost" onClick={() => navigate('/batches')}>
            Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <CommonCard className="p-0 bg-slate-800/60 backdrop-blur-md border border-slate-700">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              <p>Carregando lotes...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-900/50">
                <TableRow>
                  <TableHead className="uppercase text-xs tracking-wider text-slate-400">ID Lote</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-slate-400">Produtor</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-slate-400">Status</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-slate-400 text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentBatches.length > 0 ? recentBatches.map((batch) => (
                  <TableRow
                    key={batch.id}
                    onClick={() => handleRowClick(batch.id)}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer group"
                  >
                    <TableCell className="font-mono text-slate-300">{batch.onchain_id}</TableCell>
                    <TableCell className="font-medium text-primary-foreground">{batch.producer_name}</TableCell>
                    <TableCell>
                      <StatusBadge status={batch.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <ArrowRight className="h-4 w-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Nenhum lote recente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CommonCard>
      </section>
    </div>
  );
};

export default Dashboard;