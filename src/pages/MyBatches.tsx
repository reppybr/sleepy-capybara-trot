import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PlusCircle, Search, PackageOpen, User, Sprout, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Modal from '@/components/common/Modal'; // Import Modal
import CreateBatchWizard from '@/components/batches/CreateBatchWizard'; // Import the new wizard

// Mock data for batches
const mockBatches = [
  {
    id: "BTC-2024-089",
    variety: "Catuaí Vermelho 2SL",
    producer: "Fazenda Esperança",
    created_at: "12/11/2024",
    current_custody: "Transportadora Veloz",
    custody_role: "Logistics",
    status: "IN_TRANSIT",
    is_finalized: false
  },
  {
    id: "BTC-2024-055",
    variety: "Bourbon Amarelo",
    producer: "Fazenda Esperança",
    created_at: "20/10/2024",
    current_custody: "Torrefação Elite",
    custody_role: "Roaster",
    status: "FINALIZED",
    is_finalized: true
  },
  {
    id: "BTC-2024-092",
    variety: "Geisha Premium",
    producer: "Fazenda Santa Clara",
    created_at: "17/11/2024",
    current_custody: "Fazenda Santa Clara",
    custody_role: "Producer",
    status: "PROCESSING",
    is_finalized: false
  },
  {
    id: "BTC-2024-093",
    variety: "Arábica Blend",
    producer: "Fazenda União",
    created_at: "18/11/2024",
    current_custody: "João Silva", // Mock current user (Brand Owner) custody
    custody_role: "Brand Owner",
    status: "PROCESSING",
    is_finalized: false
  }
];

const MyBatches: React.FC = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = React.useState(mockBatches);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('todos');
  const [isCreateBatchModalOpen, setIsCreateBatchModalOpen] = React.useState(false); // New state for modal

  // Mock current user's custody name for highlighting (Brand Owner)
  const currentUserCustodyName = "João Silva"; // Changed to reflect the brand owner

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "IN_TRANSIT":
      case "PROCESSING":
        return "emandamento"; // Amber for in progress
      case "FINALIZED":
        return "concluido"; // Green for finalized
      case "CREATED":
        return "criado"; // Blue for created
      case "BLOCKED":
        return "bloqueado"; // Red for blocked
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "IN_TRANSIT":
        return "Em Trânsito";
      case "PROCESSING":
        return "Em Processamento";
      case "FINALIZED":
        return "Finalizado";
      case "CREATED":
        return "Criado";
      case "BLOCKED":
        return "Bloqueado";
      default:
        return "Desconhecido";
    }
  };

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          batch.variety.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'todos' ||
                          (statusFilter === 'processing' && (batch.status === 'PROCESSING' || batch.status === 'IN_TRANSIT')) ||
                          (statusFilter === 'finalized' && batch.status === 'FINALIZED');
    return matchesSearch && matchesStatus;
  });

  const handleCreateNewBatch = () => {
    setIsCreateBatchModalOpen(true); // Open the modal
  };

  const handleSaveNewBatch = (newBatchData: { id: string; producerName: string; variety: string; }) => {
    // Para agora, apenas adiciona aos dados mockados. Em uma aplicação real, seria uma chamada de API.
    const newMockBatch = {
      id: newBatchData.id,
      variety: newBatchData.variety,
      producer: newBatchData.producerName,
      created_at: new Date().toLocaleDateString('pt-BR'),
      current_custody: currentUserCustodyName, // Assumindo que o dono da marca cria o lote
      custody_role: "Brand Owner",
      status: "CREATED",
      is_finalized: false
    };
    setBatches((prev) => [newMockBatch, ...prev]);
    toast.success(`Lote ${newBatchData.id} criado com sucesso!`);
    setIsCreateBatchModalOpen(false);
  };

  const handleViewDetails = (batchId: string) => {
    toast.info(`Visualizando detalhes do lote: ${batchId}`);
    // navigate(`/batches/${batchId}`);
  };

  const hasBatches = filteredBatches.length > 0;

  return (
    <div className="space-y-8 py-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-foreground">Meus Lotes</h1>
          <p className="text-md text-slate-400 mt-1">Gerencie e rastreie a produção e custódia do seu café.</p>
        </div>
        <Button variant="primary" onClick={handleCreateNewBatch} className="flex items-center space-x-2">
          <PlusCircle className="h-4 w-4" />
          <span>Criar Novo Lote</span>
        </Button>
      </div>

      {/* Filters Bar */}
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
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="processing">Em Processamento</SelectItem>
            <SelectItem value="finalized">Finalizados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Batches Table / Empty State */}
      <section>
        {hasBatches ? (
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
                        <span className="font-mono text-slate-400 text-sm">{batch.id}</span>
                        <span className="font-bold text-primary-foreground">{batch.variety}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Sprout className="h-4 w-4 text-green-400" />
                        <div className="flex flex-col">
                          <span>{batch.producer}</span>
                          <span className="text-xs">{batch.created_at}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                            {batch.current_custody.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={cn("text-indigo-300", { "font-bold text-amber-400": batch.current_custody === currentUserCustodyName })}>
                          {batch.current_custody}
                          {batch.current_custody === currentUserCustodyName && <span className="ml-1 text-xs text-amber-500">(Você)</span>}
                        </div>
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
            <Button variant="primary" onClick={handleCreateNewBatch} className="flex items-center space-x-2 mt-4">
              <PlusCircle className="h-4 w-4" />
              <span>Criar Primeiro Lote</span>
            </Button>
          </Card>
        )}
      </section>

      {/* Create Batch Modal */}
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