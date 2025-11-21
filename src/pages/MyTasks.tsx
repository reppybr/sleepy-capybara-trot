import React from 'react';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import { Clock, Package, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBatches, Batch } from '@/api/batchService';

interface TaskCardProps {
  task: Batch;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();

  const handleTaskAction = () => {
    navigate(`/register-stage/${task.id}`);
  };

  const daysWaiting = Math.floor((new Date().getTime() - new Date(task.created_at).getTime()) / (1000 * 3600 * 24));
  const isUrgent = daysWaiting > 5;

  return (
    <Card className={cn("p-6 flex flex-col justify-between", { "border-red-500 ring-2 ring-red-500/50": isUrgent })}>
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-primary-foreground flex items-center space-x-2">
            <Package className="h-5 w-5 text-primary" />
            <span>{task.onchain_id}</span>
          </h3>
          {isUrgent && (
            <span className="flex items-center text-red-500 text-sm font-medium">
              <Clock className="h-4 w-4 mr-1" /> Urgente!
            </span>
          )}
        </div>
        <p className="text-muted-foreground text-sm">Produtor: {task.producer_name}</p>
        <p className="text-muted-foreground text-sm">Aguardando há {daysWaiting} dias</p>
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">Status:</span>
          <Badge variant="emandamento">Aguardando sua Ação</Badge>
        </div>
      </div>
      <Button variant="primary" className="w-full" onClick={handleTaskAction}>
        Registrar Minha Etapa
      </Button>
    </Card>
  );
};

const MyTasks: React.FC = () => {
  const { profile } = useSupabaseAuth();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['batches', 'my-tasks'],
    queryFn: () => getBatches('my-tasks'),
    enabled: !!profile && profile.role !== 'brand_owner',
  });

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-foreground">Minhas Tarefas</h1>
        <p className="text-muted-foreground text-lg">Lotes aguardando sua ação.</p>
      </div>

      {isLoading ? (
        <div className="text-center p-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Carregando suas tarefas...</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
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
    </div>
  );
};

export default MyTasks;