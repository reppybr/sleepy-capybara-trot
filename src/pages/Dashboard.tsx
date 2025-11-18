import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonCard from "@/components/common/Card"; // Using the common Card component
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Using shadcn Card sub-components for structure
import Button from '@/components/common/Button';
import KpiCard from '@/components/dashboard/KpiCard'; // New KpiCard component
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Package, CheckCircle, Layers, AlertTriangle, Plus, ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar
} from 'recharts';
import { cn } from '@/lib/utils';

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800/90 p-3 rounded-md border border-slate-700 shadow-lg text-sm text-primary-foreground">
        <p className="font-bold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// StatusBadge component for the table
interface StatusBadgeProps {
  status: string;
  label: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  let variantClasses = "";
  switch (status) {
    case "completed":
      variantClasses = "bg-emerald-500/20 text-emerald-400 border-emerald-500/20";
      break;
    case "processing":
      variantClasses = "bg-blue-500/20 text-blue-400 border-blue-500/20";
      break;
    case "shipping":
      variantClasses = "bg-purple-500/20 text-purple-400 border-purple-500/20";
      break;
    case "quality_control":
      variantClasses = "bg-amber-500/20 text-amber-400 border-amber-500/20";
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

  // Mock data for KPI cards
  const kpiData = [
    {
      id: "kpi-1",
      label: "Lotes em Produção",
      value: "12",
      trend: "+2 novos esta semana",
      trendPositive: true,
      icon: Package,
      color: "border-blue-500",
      textColor: "text-blue-400",
    },
    {
      id: "kpi-2",
      label: "Lotes Finalizados",
      value: "148",
      trend: "+15% vs mês anterior",
      trendPositive: true,
      icon: CheckCircle,
      color: "border-emerald-500",
      textColor: "text-emerald-400",
    },
    {
      id: "kpi-3",
      label: "Produção (Sacas 60kg)",
      value: "850",
      trend: "Meta mensal: 1000",
      trendPositive: false,
      icon: Layers,
      color: "border-amber-500",
      textColor: "text-amber-500",
    },
    {
      id: "kpi-4",
      label: "Ações Pendentes",
      value: "3",
      trend: "Requer atenção imediata",
      trendUrgency: true,
      icon: AlertTriangle,
      color: "border-red-500",
      textColor: "text-red-400",
    },
  ];

  // Mock data for charts
  const chartData = [
    { name: "Mai", Lotes: 20, Sacas: 120 },
    { name: "Jun", Lotes: 25, Sacas: 150 },
    { name: "Jul", Lotes: 32, Sacas: 190 },
    { name: "Ago", Lotes: 28, Sacas: 170 },
    { name: "Set", "Lotes": 35, "Sacas": 210 },
    { name: "Out", "Lotes": 42, "Sacas": 250 }
  ];

  // Mock data for recent activity table
  const mockRecentBatches = [
    { id: "L-2024-001", producer: "Fazenda Santa Inês", variety: "Catuaí Amarelo", status: "processing", status_label: "Em Processamento" },
    { id: "L-2024-002", producer: "Sítio Boa Vista", variety: "Bourbon Vermelho", status: "completed", status_label: "Finalizado" },
    { id: "L-2024-003", producer: "Fazenda Aliança", variety: "Mundo Novo", status: "shipping", status_label: "Em Transporte" },
    { id: "L-2024-004", producer: "Fazenda Santa Inês", variety: "Geisha", status: "quality_control", status_label: "Controle de Qualidade" }
  ];

  const handleRowClick = (batchId: string) => {
    navigate(`/lotes/${batchId}`);
  };

  return (
    <div className="space-y-10 py-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-primary-foreground">Visão Geral</h1>
          <p className="text-lg text-muted-foreground mt-1">Bem-vindo de volta. Aqui está o resumo da sua produção de café.</p>
        </div>
        {/* Botão "Novo Lote" removido */}
      </div>

      {/* KPI Grid Section */}
      <section>
        <h2 className="text-2xl font-semibold text-primary-foreground mb-6">Performance Operacional</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((kpi) => (
            <KpiCard key={kpi.id} {...kpi} />
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section>
        <h2 className="text-2xl font-semibold text-primary-foreground mb-2">Volume de Produção Mensal</h2>
        <p className="text-muted-foreground mb-6">Lotes processados e finalizados nos últimos 6 meses.</p>
        <CommonCard className="p-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/20)' }} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Lotes" fill="#f59e0b" radius={[10, 10, 0, 0]} />
              <Bar dataKey="Sacas" fill="#8884d8" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CommonCard>
      </section>

      {/* Recent Batches Table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-primary-foreground">Lotes Recentes</h2>
          <Button variant="ghost" onClick={() => navigate('/batches')}>
            Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <CommonCard className="p-0 bg-slate-800/60 backdrop-blur-md border border-slate-700">
          <Table>
            <TableHeader className="bg-slate-900/50">
              <TableRow>
                <TableHead className="uppercase text-xs tracking-wider text-slate-400">ID Lote</TableHead>
                <TableHead className="uppercase text-xs tracking-wider text-slate-400">Produtor</TableHead>
                <TableHead className="uppercase text-xs tracking-wider text-slate-400">Variedade</TableHead>
                <TableHead className="uppercase text-xs tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="uppercase text-xs tracking-wider text-slate-400 text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRecentBatches.map((batch) => (
                <TableRow
                  key={batch.id}
                  onClick={() => handleRowClick(batch.id)}
                  className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors cursor-pointer group"
                >
                  <TableCell className="font-mono text-slate-300">{batch.id}</TableCell>
                  <TableCell className="font-medium text-primary-foreground">{batch.producer}</TableCell>
                  <TableCell className="text-slate-400">{batch.variety}</TableCell>
                  <TableCell>
                    <StatusBadge status={batch.status} label={batch.status_label} />
                  </TableCell>
                  <TableCell className="text-right">
                    <ArrowRight className="h-4 w-4 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CommonCard>
      </section>
    </div>
  );
};

export default Dashboard;