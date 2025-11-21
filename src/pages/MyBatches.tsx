import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PlusCircle, Search, PackageOpen, Sprout, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Modal from '@/components/common/Modal';
import CreateBatchWizard from '@/components/wizards/CreateBatchWizard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBatches, createBatch, Batch } from '@/api/batchService';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

const MyBatches: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { profile } = useSupabaseAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = React.useState(false);

  const { data: batches = [], isLoading } = useQuery({
    queryKey: ['batches', 'my-batches'],
    queryFn: () => getBatches('my-batches'),
    enabled: !!profile,
  });

  const createBatchMutation = useMutation({
    mutationFn: createBatch,
    onSuccess: (data) => {
      toast.success(`Lote ${data.batch.onchain_id} criado com sucesso!`);
      queryClient.invalidateQueries({ queryKey: ['batches', 'my-batches'] });
      setIsCreateBatchModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Falha ao criar o lote: ${error.message}`);
    },
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "processing": return "emandamento";
      case "finalized": return "concluido";
      case "created": return "criado";
      default: return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "processing": return "Em Processamento";
      case "finalized": return "Finalizado";
      case "created": return "Criado";
      default: return "Desconhecido";
    }
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.onchain_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (batch.variety && batch.variety.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || batch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveNewBatch = (newBatchData: any) => {
    createBatchMutation.mutate(newBatchData);
  };

  const handleViewDetails = (batchId: string) => {
    navigate(`/batches/${batchId}`);
  };

  return (
    <div className="space-y-8 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-foreground">Meus Lotes</h1>
          <p className="text-md text-slate-400 mt-1">Gerencie e rastreie a produção e custódia do seu café.</p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateBatchModalOpen(true)} className="flex items-center space-x-2">
          <PlusCircle className="h-4 w-4" />
          <span>Criar Novo Lote</span>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-lg bg-slate-800/60 backdrop-blur-md border border-slate-700 shadow-lg">
        <div className="relative flex-1 w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por ID ou Variedade..."
            className="w-full pl-9 bg-slate-700 border-slate-600 text-primary-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select onValueChange={setStatusFilter} value={statusFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-slate-700 border-slate-600 text-primary-foreground">
            <SelectValue placeholder="Filtrar por Status" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-primary-foreground">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="processing">Em Processamento</SelectItem>
            <SelectItem value="finalized">Finalizados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <section>
        {isLoading ? (
          <div className="text-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Carregando seus lotes...</p>
          </div>
        ) : filteredBatches.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="[border-spacing:0_1rem] border-separate">
              <TableHeader className="bg-transparent">
                <TableRow className="bg-transparent hover:bg-transparent">
                  <TableHead className="uppercase text-xs tracking-wider text-slate-400">Identificação</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-slate-400">Origem</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-slate-400">Custódia Atual</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-slate-400">Status</TableHead>
                  <TableHead className="uppercase text-xs tracking-wider text-slate-400 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((batch) => (
                  <TableRow
                    key={batch.id}
                    className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 hover:border-amber-500/50 transition-all duration-300 ease-in-out"
                  >
                    <TableCell className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-mono text-slate-400 text-sm">{batch.onchain_id}</span>
                        <span className="font-bold text-primary-foreground">{batch.variety || 'N/A'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Sprout className="h-4 w-4 text-green-400" />
                        <div className="flex flex-col">
                          <span>{batch.producer_name}</span>
                          <span className="text-xs">{new Date(batch.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                            {batch.users?.name.split(' ').map(n => n[0]).join('') || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>{batch.users?.name || 'Desconhecido'}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <Badge variant={getStatusBadgeVariant(batch.status)}>{getStatusLabel(batch.status)}</Badge>
                    </TableCell>
                    <TableCell className="py-4 px-6 text-right">
                      <Button variant="ghost" onClick={() => handleViewDetails(batch.id)} className="hover:bg-slate-700">
                        Ver Detalhes <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Card className="p-8 text-center flex flex-col items-center justify-center space-y-4 bg-slate-800/60 backdrop-blur-md border border-slate-700">
            <PackageOpen className="h-20 w-20 text-slate-600" />
            <h3 className="text-xl font-semibold text-primary-foreground">Você ainda não tem lotes registrados.</h3>
            <p className="text-muted-foreground max-w-md">
              Comece sua rastreabilidade agora criando seu primeiro lote.
            </p>
            <Button variant="primary" onClick={() => setIsCreateBatchModalOpen(true)} className="flex items-center space-x-2 mt-4">
              <PlusCircle className="h-4 w-4" />
              <span>Criar Primeiro Lote</span>
            </Button>
          </Card>
        )}
      </section>

      <Modal
        open={isCreateBatchModalOpen}
        onOpenChange={setIsCreateBatchModalOpen}
        title="Criar Novo Lote de Café"
        description="Preencha os detalhes para registrar um novo lote na cadeia de rastreabilidade."
        className="sm:max-w-2xl"
      >
        <CreateBatchWizard
          onClose={() => setIsCreateBatchModalOpen(false)}
          onSave={handleSaveNewBatch}
        />
      </Modal>
    </div>
  );
};

export default MyBatches;