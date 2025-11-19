import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { Clock, Package, Factory, Truck, CheckCircle, XCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useInjectedTask } from '@/context/InjectedTaskContext';
import { useNavigate } from 'react-router-dom';

// Mock data for tasks
const mockPendingTasks = [
  {
    id: 'task-001',
    batchId: 'FSM-001',
    producer: 'Fazenda Santa Maria',
    arrivalDate: '2024-07-20',
    daysWaiting: 7,
    status: 'Aguardando Torra',
    actionLabel: 'Iniciar Torra',
    role: 'Torrefador',
    assignedToPublicKey: '0xroasterkey123',
  },
  {
    id: 'task-002',
    batchId: 'FSC-25-9X7K',
    producer: 'Fazenda Santa Clara',
    arrivalDate: '2025-11-18',
    daysWaiting: 0,
    status: 'Aguardando Recebimento',
    actionLabel: 'Registrar Minha Etapa',
    role: 'Transportadora',
    assignedToPublicKey: 'WORKER-WALLET-456', // Logistics partner's public key
  },
  {
    id: 'task-003',
    batchId: 'FBB-003',
    producer: 'Fazenda Boa Vista',
    arrivalDate: '2024-07-25',
    daysWaiting: 2,
    status: 'Aguardando Recebimento',
    actionLabel: 'Registrar Minha Etapa', // Fixed: Should be "Registrar Minha Etapa" for warehouse
    role: 'Armazém',
    assignedToPublicKey: '0xwarehousekey123',
  },
  {
    id: 'task-prod-001', // New task for producer demo user
    batchId: 'FES-2024-PROD',
    producer: 'Fazenda Esperança',
    arrivalDate: '2024-11-20',
    daysWaiting: 0,
    status: 'Aguardando Colheita',
    actionLabel: 'Registrar Minha Etapa',
    role: 'Produtor',
    assignedToPublicKey: '0xesperancakey123', // Producer demo user's public key
  },
  {
    id: 'task-wh-001', // New task for warehouse demo user
    batchId: 'ARM-2024-WH',
    producer: 'Fazenda União',
    arrivalDate: '2024-11-21',
    daysWaiting: 0,
    status: 'Aguardando Armazenagem',
    actionLabel: 'Registrar Minha Etapa',
    role: 'Armazém',
    assignedToPublicKey: '0xwarehousekey123', // Warehouse demo user's public key
  },
];

const mockHistoryTasks = [
  {
    id: 'task-H01',
    batchId: 'FSM-001',
    producer: 'Fazenda Santa Maria',
    completionDate: '2024-07-27',
    status: 'Torra Concluída',
    actionLabel: 'Ver Detalhes',
    role: 'Torrefador',
  },
  {
    id: 'task-H02',
    batchId: 'FLA-001',
    producer: 'Finca La Aurora',
    completionDate: '2024-07-15',
    status: 'Transporte Finalizado',
    actionLabel: 'Ver Detalhes',
    role: 'Transportadora',
  },
];

interface TaskCardProps {
  task: typeof mockPendingTasks[0];
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const isUrgent = task.daysWaiting > 5;
  const navigate = useNavigate();

  const getStatusVariant = (status: string) => {
    if (status.includes('Torra')) return 'emandamento';
    if (status.includes('Transporte')) return 'criado';
    if (status.includes('Recebimento')) return 'criado';
    if (status.includes('Colheita')) return 'criado'; // New status for producer
    if (status.includes('Armazenagem')) return 'criado'; // New status for warehouse
    if (status.includes('Concluída') || status.includes('Finalizado')) return 'concluido';
    return 'default';
  };

  const handleTaskAction = () => {
    // All roles now use the same action: navigate to register-stage
    navigate(`/register-stage/${task.batchId}`);
  };

  return (
    <Card className={cn("p-6 flex flex-col justify-between", { "border-red-500 ring-2 ring-red-500/50": isUrgent })}>
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-primary-foreground flex items-center space-x-2">
            <Package className="h-5 w-5 text-primary" />
            <span>{task.batchId}</span>
          </h3>
          {isUrgent && (
            <span className="flex items-center text-red-500 text-sm font-medium">
              <Clock className="h-4 w-4 mr-1" /> Urgente!
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-sm">Produtor: {task.producer}</p>
        <p className="text-muted-foreground text-sm">Chegou há {task.daysWaiting} dias</p>
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">Status:</span>
          <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
        </div>
      </div>
      <Button variant="primary" className="w-full" onClick={handleTaskAction}>
        {task.actionLabel}
      </Button>
    </Card>
  );
};

const MyTasks: React.FC = () => {
  const { user } = useAuth();
  const { injectedTask } = useInjectedTask();

  const currentPendingTasks = React.useMemo(() => {
    if (!user) return [];
    return mockPendingTasks.filter(task => task.assignedToPublicKey === user.public_key);
  }, [user]);

  const hasPendingTasks = currentPendingTasks.length > 0;
  const hasHistoryTasks = mockHistoryTasks.length > 0;

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-foreground">Minhas Tarefas</h1>
          <p className="text-muted-foreground text-lg">Lotes aguardando sua ação</p>
        </div>
      </div>

      <Tabs defaultValue="pendentes" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-card border border-border">
          <TabsTrigger value="pendentes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Pendentes</TabsTrigger>
          <TabsTrigger value="historico" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Histórico</TabsTrigger>
        </TabsList>
        <TabsContent value="pendentes" className="mt-6">
          {hasPendingTasks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center flex flex-col items-center justify-center space-y-4">
              <CheckCircle className="h-20 w-20 text-green-500" />
              <h3 className="text-xl font-semibold text-primary-foreground">Você está em dia!</h3>
              <p className="text-muted-foreground max-w-md">
                Nenhum lote pendente aguardando sua ação no momento.
              </p>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="historico" className="mt-6">
          {hasHistoryTasks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockHistoryTasks.map((task) => (
                <Card key={task.id} className="p-6 flex flex-col justify-between">
                  <div className="space-y-3 mb-4">
                    <h3 className="text-xl font-bold text-primary-foreground flex items-center space-x-2">
                      <Package className="h-5 w-5 text-primary" />
                      <span>{task.batchId}</span>
                    </h3>
                    <p className="text-muted-foreground text-sm">Produtor: {task.producer}</p>
                    <p className="text-muted-foreground text-sm">Concluído em: {task.completionDate}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground text-sm">Status:</span>
                      <Badge variant={task.status.includes('Concluída') || task.status.includes('Finalizado') ? 'concluido' : 'default'}>{task.status}</Badge>
                    </div>
                  </div>
                  <Button variant="secondary" className="w-full" onClick={() => navigate(`/batches/${task.batchId}`)}>
                    {task.actionLabel}
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center flex flex-col items-center justify-center space-y-4">
              <XCircle className="h-20 w-20 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-primary-foreground">Nenhum histórico de tarefas</h3>
              <p className="text-muted-foreground max-w-md">
                Você ainda não concluiu nenhuma tarefa.
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyTasks;