import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, Leaf, TrendingUp, Clock, PlusCircle } from 'lucide-react';

// Mock data for KPI cards
const kpiData = [
  { title: 'Lotes Ativos', value: '12', icon: Package, description: 'Lotes atualmente em processamento' },
  { title: 'Total Processado', value: '2.500 kg', icon: Leaf, description: 'Café processado este mês' },
  { title: 'Ações Pendentes', value: '3', icon: Clock, description: 'Tarefas aguardando sua atenção' },
];

// Mock data for recent activity table
const mockRecentBatches = [
  { id: 'FSM-2024-001', producer: 'Fazenda Santa Maria', stage: 'Torrefação', status: 'Concluído', date: '2024-07-20' },
  { id: 'FLA-2024-002', producer: 'Finca La Aurora', stage: 'Transporte', status: 'Em Andamento', date: '2024-07-19' },
  { id: 'FBB-2024-003', producer: 'Fazenda Boa Vista', stage: 'Colheita', status: 'Criado', date: '2024-07-18' },
  { id: 'FSM-2024-004', producer: 'Fazenda Santa Maria', stage: 'Secagem', status: 'Bloqueado', date: '2024-07-17' },
];

const Dashboard: React.FC = () => {
  const hasBatches = mockRecentBatches.length > 0; // Simulate data presence

  return (
    <div className="space-y-8 py-8">
      <h1 className="text-3xl font-bold text-primary-foreground">Visão Geral</h1>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="p-6 flex flex-col justify-between">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-foreground">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Recent Activity Table or Empty State */}
      <section>
        <h2 className="text-2xl font-semibold text-primary-foreground mb-4">Atividade Recente</h2>
        {hasBatches ? (
          <Card className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-muted-foreground">ID do Lote</TableHead>
                  <TableHead className="text-muted-foreground">Produtor</TableHead>
                  <TableHead className="text-muted-foreground">Estágio Atual</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="text-muted-foreground">Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentBatches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium text-primary-foreground">{batch.id}</TableCell>
                    <TableCell className="text-muted-foreground">{batch.producer}</TableCell>
                    <TableCell className="text-muted-foreground">{batch.stage}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          batch.status === 'Concluído'
                            ? 'concluido'
                            : batch.status === 'Em Andamento'
                            ? 'emandamento'
                            : batch.status === 'Criado'
                            ? 'criado'
                            : 'bloqueado'
                        }
                      >
                        {batch.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{batch.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <Card className="p-8 text-center flex flex-col items-center justify-center space-y-4">
            <img src="/placeholder.svg" alt="Empty state illustration" className="h-32 w-32 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-primary-foreground">Nenhum lote encontrado</h3>
            <p className="text-muted-foreground max-w-md">
              Parece que você ainda não criou nenhum lote de café. Comece adicionando seu primeiro lote para rastrear sua jornada.
            </p>
            <Button variant="primary" className="flex items-center space-x-2">
              <PlusCircle className="h-4 w-4" />
              <span>Criar Primeiro Lote</span>
            </Button>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Dashboard;