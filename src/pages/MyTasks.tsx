import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { Clock, Package, Factory, Truck, CheckCircle, XCircle, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { useInjectedTask } from '@/context/InjectedTaskContext'; // Import useInjectedTask
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// Mock data for tasks
const mockPendingTasks = [
  {
    id: 'task-001',
    batchId: 'FSM-001', // Changed to match expected format for navigation
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
    batchId: 'FLA-002', // Changed to match expected format for navigation
    producer: 'Finca La Aurora',
    arrivalDate: '2024-07-22',
    daysWaiting: 5,
    status: 'Aguardando Transporte',
    actionLabel: 'Registrar Transporte',
    role: 'Transportadora',
    assignedToPublicKey: '0xlogisticskey123',
  },
  {
    id: 'task-003',
    batchId: 'FBB-003', // Changed to match expected format for navigation
    producer: 'Fazenda Boa Vista',
    arrivalDate: '2024-07-25',
    daysWaiting: 2,
    status: 'Aguardando Recebimento',
    actionLabel: 'Confirmar Recebimento',
    role: 'Armazém',
    assignedToPublicKey: '0xwarehousekey123',
  },
];

const mockHistoryTasks = [
  {
    id: 'task-H01',
    batchId: 'FSM-001', // Changed to match expected format for navigation
    producer: 'Fazenda Santa Maria',
    completionDate: '2024-07-27',
    status: 'Torra Concluída',
    actionLabel: 'Ver Detalhes',
    role: 'Torrefador',
  },
  {
    id: 'task-H02',
    batchId: 'FLA-001', // Changed to match expected format for navigation
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
  const navigate = useNavigate(); // Use useNavigate hook

  const getStatusVariant = (status: string) => {
    if (status.includes('Torra')) return 'emandamento';
    if (status.includes('Transporte')) return 'criado';
    if (status.includes('Recebimento')) return 'criado';
    if (status.includes('Concluída') || status.includes('Finalizado')) return 'concluido';
    return 'default';
  };

  const handleTaskAction = () => {
    // Navigate to the batch details page
    navigate(`/batches/${task.batchId}`);
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
  const { injectedTask } = useInjectedTask(); // No need for setInjectedTask here for clearing

  // Removed the useEffect for automatic redirection

  const currentPendingTasks = React.useMemo(() => {
    if (!user) return [];

    let tasksForUser = mockPendingTasks.filter(task => task.assignedToPublicKey === user.public_key);

    // If user is employee_partner and there's an injected task, add it
    if (user.role === 'employee_partner' && injectedTask) {
      // Ensure the injected task is not already present and is assigned to this user
      if (!tasksForUser.some(task => task.id === injectedTask.id) && injectedTask.assignedToPublicKey === user.public_key) {
        tasksForUser = [
          {
            id: injectedTask.id,
            batchId: injectedTask.batchId,
            producer: injectedTask.producer,
            arrivalDate: injectedTask.arrivalDate,
            daysWaiting: injectedTask.daysWaiting,
            status: injectedTask.status,
            actionLabel: injectedTask.actionLabel || 'Ver Detalhes', // Use default if actionLabel is undefined
            role: injectedTask.role,
            assignedToPublicKey: injectedTask.assignedToPublicKey,
          },
          ...tasksForUser
        ];
      }
    }
    return tasksForUser;
  }, [user, injectedTask]);

  const hasPendingTasks = currentPendingTasks.length > 0;
  const hasHistoryTasks = mockHistoryTasks.length > 0; // History tasks are not dynamic for now

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
                  <Button variant="secondary" className="w-full">
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