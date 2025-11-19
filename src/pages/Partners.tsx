import React from 'react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, User, Users, Building2, Mail, KeyRound, ExternalLink, Edit, Trash2, UserPlus, Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { roles } from '@/constants/roles';
import { PartnerRole, Partner } from '@/hooks/use-partners';
import { useAuth } from '@/context/AuthContext'; // Import useAuth to get current user's public key

// Mock data for partners
const mockPartnersInitial: Partner[] = [
  { id: 'p1', name: 'Café do Sol Ltda.', role: 'producer', email: 'contato@cafedosol.com', public_key: '0xabc...123' },
  { id: 'p2', name: 'Logística Rápida S.A.', role: 'logistics', email: 'info@lograpida.com', public_key: '0xdef...456' },
  { id: 'p3', name: 'Torrefação Aroma Fino', role: 'roaster', email: 'vendas@aromafino.com', public_key: '0xghi...789' },
];

// Mock data for connection requests
interface ConnectionRequest {
  id: string;
  senderName: string;
  senderPublicKey: string;
  senderRole: PartnerRole;
  timestamp: string;
  message?: string;
}

const mockConnectionRequestsInitial: ConnectionRequest[] = [
  {
    id: 'req-001',
    senderName: 'Fazenda Verde Vale',
    senderPublicKey: '0xmnp...345',
    senderRole: 'producer',
    timestamp: '2024-11-20T10:00:00Z',
    message: 'Gostaríamos de conectar para futuras parcerias de fornecimento.',
  },
  {
    id: 'req-002',
    senderName: 'Armazém Central',
    senderPublicKey: '0xopq...678',
    senderRole: 'warehouse',
    timestamp: '2024-11-19T15:30:00Z',
    message: 'Temos interesse em oferecer nossos serviços de armazenagem.',
  },
];

// Mock data for sent requests
interface SentRequest {
  id: string;
  recipientName: string;
  recipientPublicKey: string;
  recipientRole: PartnerRole;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
}

const mockSentRequestsInitial: SentRequest[] = [
  {
    id: 'sent-001',
    recipientName: 'Distribuidora Grão Nobre',
    recipientPublicKey: '0xjkl...012',
    recipientRole: 'distributor',
    timestamp: '2024-11-18T11:00:00Z',
    status: 'pending',
    message: 'Olá, estamos expandindo nossa rede de distribuição.',
  },
];

const Partners: React.FC = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth(); // Get current user for public key
  const [partners, setPartners] = React.useState<Partner[]>(mockPartnersInitial);
  const [connectionRequests, setConnectionRequests] = React.useState<ConnectionRequest[]>(mockConnectionRequestsInitial);
  const [sentRequests, setSentRequests] = React.useState<SentRequest[]>(mockSentRequestsInitial);

  const [isSendRequestModalOpen, setIsSendRequestModalOpen] = React.useState(false);
  const [newRequestData, setNewRequestData] = React.useState({
    recipientIdentifier: '', // Can be public key or email
    addMethod: 'publicKey' as 'publicKey' | 'email',
    message: '',
  });
  const [sendRequestErrors, setSendRequestErrors] = React.useState<{ [key: string]: boolean }>({});

  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = React.useState(false);
  const [partnerToDelete, setPartnerToDelete] = React.useState<Partner | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [partnerToEdit, setPartnerToEdit] = React.useState<Partner | null>(null);
  const [editedPartnerData, setEditedPartnerData] = React.useState({
    id: '',
    companyName: '',
    publicKey: '',
    role: '' as PartnerRole,
    email: '',
  });
  const [editErrors, setEditErrors] = React.useState<{ [key: string]: boolean }>({});

  // Helper to get role label from value
  const getRoleLabel = (roleValue: PartnerRole) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  // --- Send Connection Request Logic ---
  const handleSendRequestInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setNewRequestData((prev) => ({ ...prev, [id]: value }));
    setSendRequestErrors((prev) => ({ ...prev, [id]: false }));
  };

  const handleSendRequestMethodChange = (value: 'publicKey' | 'email') => {
    setNewRequestData((prev) => ({ ...prev, addMethod: value, recipientIdentifier: '' })); // Clear identifier on method change
    setSendRequestErrors({});
  };

  const validateSendRequestForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!newRequestData.recipientIdentifier.trim()) {
      newErrors.recipientIdentifier = true;
    }
    setSendRequestErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendConnectionRequest = () => {
    if (!validateSendRequestForm()) {
      toast.error("Por favor, preencha o identificador do parceiro.");
      return;
    }

    // Simulate sending request
    const newSentRequest: SentRequest = {
      id: `sent-${Date.now()}`,
      recipientName: `Parceiro ${newRequestData.recipientIdentifier.substring(0, 8)}...`, // Mock name
      recipientPublicKey: newRequestData.recipientIdentifier,
      recipientRole: 'unknown' as PartnerRole, // Role is unknown until accepted
      timestamp: new Date().toISOString(),
      status: 'pending',
      message: newRequestData.message,
    };
    setSentRequests((prev) => [...prev, newSentRequest]);
    toast.success("Solicitação de conexão enviada com sucesso!");
    setIsSendRequestModalOpen(false);
    setNewRequestData({ recipientIdentifier: '', addMethod: 'publicKey', message: '' });
    setSendRequestErrors({});
  };

  // --- Handle Incoming Requests Logic ---
  const handleAcceptRequest = (request: ConnectionRequest) => {
    // Simulate adding to partners
    const newPartner: Partner = {
      id: `p${Date.now()}`,
      name: request.senderName,
      role: request.senderRole,
      email: 'mock@email.com', // Mock email
      public_key: request.senderPublicKey,
    };
    setPartners((prev) => [...prev, newPartner]);
    setConnectionRequests((prev) => prev.filter((req) => req.id !== request.id));
    toast.success(`Conexão com "${request.senderName}" aceita!`);

    // Optionally, update the sender's sent request status (if we had a backend)
    setSentRequests(prev => prev.map(sr => sr.recipientPublicKey === request.senderPublicKey ? { ...sr, status: 'accepted' } : sr));
  };

  const handleRejectRequest = (requestId: string) => {
    setConnectionRequests((prev) => prev.filter((req) => req.id !== requestId));
    toast.info("Solicitação de conexão rejeitada.");

    // Optionally, update the sender's sent request status (if we had a backend)
    // For now, we just remove it from incoming.
  };

  // --- Delete Partner Logic (for accepted partners) ---
  const handleDeleteClick = (partner: Partner) => {
    setPartnerToDelete(partner);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (partnerToDelete) {
      setPartners((prev) => prev.filter((p) => p.id !== partnerToDelete.id));
      toast.success(`Parceiro "${partnerToDelete.name}" excluído com sucesso!`);
      setPartnerToDelete(null);
      setIsDeleteConfirmModalOpen(false);
    }
  };

  // --- Edit Partner Logic (for accepted partners) ---
  const handleEditClick = (partner: Partner) => {
    setPartnerToEdit(partner);
    setEditedPartnerData({
      id: partner.id,
      companyName: partner.name,
      publicKey: partner.public_key,
      role: partner.role,
      email: partner.email,
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditedPartnerData((prev) => ({ ...prev, [id]: value }));
    setEditErrors((prev) => ({ ...prev, [id]: false }));
  };

  const handleEditSelectChange = (value: PartnerRole) => {
    setEditedPartnerData((prev) => ({ ...prev, role: value }));
    setEditErrors((prev) => ({ ...prev, role: false }));
  };

  const validateEditForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!editedPartnerData.companyName) newErrors.companyName = true;
    if (!editedPartnerData.role) newErrors.role = true;
    if (!editedPartnerData.publicKey && !editedPartnerData.email) {
      newErrors.publicKey = true;
      newErrors.email = true;
    }
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = () => {
    if (!validateEditForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    setPartners((prev) =>
      prev.map((p) =>
        p.id === editedPartnerData.id
          ? {
              ...p,
              name: editedPartnerData.companyName,
              role: editedPartnerData.role,
              email: editedPartnerData.email,
              public_key: editedPartnerData.publicKey,
            }
          : p
      )
    );
    toast.success(`Parceiro "${editedPartnerData.companyName}" atualizado com sucesso!`);
    setIsEditModalOpen(false);
    setPartnerToEdit(null);
    setEditedPartnerData({ id: '', companyName: '', publicKey: '', role: '' as PartnerRole, email: '' });
    setEditErrors({});
  };

  const handleViewProfileClick = (partnerName: string) => {
    toast.info(`Visualizando perfil de ${partnerName}`);
  };

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-foreground">Minha Rede de Parceiros</h1>
        <Button variant="primary" onClick={() => setIsSendRequestModalOpen(true)} className="flex items-center space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Conectar com Parceiro</span>
        </Button>
      </div>

      <Tabs defaultValue="myNetwork" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
          <TabsTrigger value="myNetwork" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Users className="h-4 w-4 mr-2" /> Minha Rede ({partners.length})
          </TabsTrigger>
          <TabsTrigger value="incomingRequests" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Plus className="h-4 w-4 mr-2" /> Solicitações Recebidas ({connectionRequests.length})
          </TabsTrigger>
          <TabsTrigger value="sentRequests" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Clock className="h-4 w-4 mr-2" /> Solicitações Enviadas ({sentRequests.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab Content: Minha Rede */}
        <TabsContent value="myNetwork" className="mt-6">
          {partners.length > 0 ? (
            isMobile ? (
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner) => (
                  <Card key={partner.id} className="p-6 flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                        {partner.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold text-primary-foreground">{partner.name}</h3>
                    <p className="text-muted-foreground">{getRoleLabel(partner.role)}</p>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="secondary" size="sm" onClick={() => handleEditClick(partner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteClick(partner)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleViewProfileClick(partner.name)}>
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </section>
            ) : (
              <section>
                <Card className="p-0 bg-slate-800/60 backdrop-blur-md border border-slate-700">
                  <Table>
                    <TableHeader className="bg-slate-900/50">
                      <TableRow>
                        <TableHead className="uppercase text-xs tracking-wider text-slate-400">Empresa</TableHead>
                        <TableHead className="uppercase text-xs tracking-wider text-slate-400">Papel</TableHead>
                        <TableHead className="uppercase text-xs tracking-wider text-slate-400">Email</TableHead>
                        <TableHead className="uppercase text-xs tracking-wider text-slate-400">Chave Pública</TableHead>
                        <TableHead className="uppercase text-xs tracking-wider text-slate-400 text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partners.map((partner) => (
                        <TableRow
                          key={partner.id}
                          className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                        >
                          <TableCell className="font-medium text-primary-foreground">{partner.name}</TableCell>
                          <TableCell className="text-slate-400">{getRoleLabel(partner.role)}</TableCell>
                          <TableCell className="text-slate-400">{partner.email}</TableCell>
                          <TableCell className="font-mono text-slate-300">{partner.public_key}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => handleViewProfileClick(partner.name)} className="hover:bg-slate-700">
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleEditClick(partner)} className="text-blue-400 hover:bg-slate-700">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(partner)} className="text-red-400 hover:bg-red-900/20">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </section>
            )
          ) : (
            <Card className="p-8 text-center flex flex-col items-center justify-center space-y-4 bg-slate-800/60 backdrop-blur-md border border-slate-700">
              <Users className="h-20 w-20 text-slate-600" />
              <h3 className="text-xl font-semibold text-primary-foreground">Sua rede de parceiros está vazia.</h3>
              <p className="text-muted-foreground max-w-md">
                Comece a construir sua rede enviando uma solicitação de conexão.
              </p>
              <Button variant="primary" onClick={() => setIsSendRequestModalOpen(true)} className="flex items-center space-x-2 mt-4">
                <UserPlus className="h-4 w-4" />
                <span>Conectar com Parceiro</span>
              </Button>
            </Card>
          )}
        </TabsContent>

        {/* Tab Content: Solicitações Recebidas */}
        <TabsContent value="incomingRequests" className="mt-6">
          {connectionRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectionRequests.map((request) => (
                <Card key={request.id} className="p-6 space-y-4 bg-slate-800/60 backdrop-blur-md border border-slate-700">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-500 text-white text-lg">
                        {request.senderName.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-foreground">{request.senderName}</h3>
                      <p className="text-sm text-muted-foreground">{getRoleLabel(request.senderRole)}</p>
                    </div>
                  </div>
                  {request.message && (
                    <p className="text-sm text-slate-400 italic border-l-2 border-slate-600 pl-3">"{request.message}"</p>
                  )}
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="secondary" size="sm" onClick={() => handleRejectRequest(request.id)}>
                      <X className="h-4 w-4 mr-2" /> Rejeitar
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleAcceptRequest(request)}>
                      <Check className="h-4 w-4 mr-2" /> Aceitar
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center flex flex-col items-center justify-center space-y-4 bg-slate-800/60 backdrop-blur-md border border-slate-700">
              <UserPlus className="h-20 w-20 text-slate-600" />
              <h3 className="text-xl font-semibold text-primary-foreground">Nenhuma solicitação de conexão pendente.</h3>
              <p className="text-muted-foreground max-w-md">
                Você está em dia com suas conexões!
              </p>
            </Card>
          )}
        </TabsContent>

        {/* Tab Content: Solicitações Enviadas */}
        <TabsContent value="sentRequests" className="mt-6">
          {sentRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sentRequests.map((request) => (
                <Card key={request.id} className="p-6 space-y-4 bg-slate-800/60 backdrop-blur-md border border-slate-700">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-purple-500 text-white text-lg">
                        {request.recipientName.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-primary-foreground">{request.recipientName}</h3>
                      <p className="text-sm text-muted-foreground">{getRoleLabel(request.recipientRole)}</p>
                    </div>
                  </div>
                  {request.message && (
                    <p className="text-sm text-slate-400 italic border-l-2 border-slate-600 pl-3">"{request.message}"</p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      request.status === 'pending' && "bg-amber-500/20 text-amber-400",
                      request.status === 'accepted' && "bg-emerald-500/20 text-emerald-400",
                      request.status === 'rejected' && "bg-red-500/20 text-red-400"
                    )}>
                      {request.status === 'pending' && "Pendente"}
                      {request.status === 'accepted' && "Aceita"}
                      {request.status === 'rejected' && "Rejeitada"}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Enviado em: {new Date(request.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center flex flex-col items-center justify-center space-y-4 bg-slate-800/60 backdrop-blur-md border border-slate-700">
              <Clock className="h-20 w-20 text-slate-600" />
              <h3 className="text-xl font-semibold text-primary-foreground">Nenhuma solicitação de conexão enviada.</h3>
              <p className="text-muted-foreground max-w-md">
                Envie uma solicitação para expandir sua rede de parceiros.
              </p>
              <Button variant="primary" onClick={() => setIsSendRequestModalOpen(true)} className="flex items-center space-x-2 mt-4">
                <UserPlus className="h-4 w-4" />
                <span>Conectar com Parceiro</span>
              </Button>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Send Connection Request Modal */}
      <Modal
        open={isSendRequestModalOpen}
        onOpenChange={setIsSendRequestModalOpen}
        title="Enviar Solicitação de Conexão"
        description="Envie uma solicitação para conectar-se com outro parceiro na rede."
        className="sm:max-w-lg"
      >
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" /> Detalhes do Parceiro
            </h3>
            <Tabs defaultValue="publicKey" className="w-full" onValueChange={handleSendRequestMethodChange}>
              <TabsList className="grid w-full grid-cols-2 bg-card border border-border">
                <TabsTrigger value="publicKey" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <KeyRound className="h-4 w-4 mr-2" /> Chave Pública
                </TabsTrigger>
                <TabsTrigger value="email" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Mail className="h-4 w-4 mr-2" /> Email
                </TabsTrigger>
              </TabsList>
              <TabsContent value="publicKey" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipientIdentifier" className="sm:text-right text-primary-foreground">
                    Chave Pública
                  </Label>
                  <div className="sm:col-span-3">
                    <Input
                      id="recipientIdentifier"
                      value={newRequestData.recipientIdentifier}
                      onChange={handleSendRequestInputChange}
                      className={cn("bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": sendRequestErrors.recipientIdentifier })}
                      placeholder="Chave Pública (Wallet) do Parceiro"
                    />
                    {sendRequestErrors.recipientIdentifier && (
                      <p className="text-red-500 text-xs mt-1">A chave pública é obrigatória.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="email" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipientIdentifier" className="sm:text-right text-primary-foreground">
                    Email
                  </Label>
                  <div className="sm:col-span-3">
                    <Input
                      id="recipientIdentifier"
                      type="email"
                      value={newRequestData.recipientIdentifier}
                      onChange={handleSendRequestInputChange}
                      className={cn("bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": sendRequestErrors.recipientIdentifier })}
                      placeholder="email@parceiro.com"
                    />
                    {sendRequestErrors.recipientIdentifier && (
                      <p className="text-red-500 text-xs mt-1">O email é obrigatório.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
              <Label htmlFor="message" className="sm:text-right text-primary-foreground">
                Mensagem (Opcional)
              </Label>
              <div className="sm:col-span-3">
                <Textarea
                  id="message"
                  value={newRequestData.message}
                  onChange={handleSendRequestInputChange}
                  className="bg-slate-700 border-slate-600 text-primary-foreground min-h-[80px]"
                  placeholder="Ex: Olá, gostaríamos de explorar uma parceria..."
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="primary" onClick={handleSendConnectionRequest}>
            Enviar Solicitação
          </Button>
        </div>
      </Modal>

      {/* Edit Partner Modal */}
      <Modal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title={`Editar Parceiro: ${partnerToEdit?.name}`}
        description="Atualize os detalhes do parceiro."
        className="sm:max-w-lg"
      >
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Informações da Empresa
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="companyName" className="sm:text-right text-primary-foreground">
                Nome
              </Label>
              <div className="sm:col-span-3">
                <Input
                  id="companyName"
                  value={editedPartnerData.companyName}
                  onChange={handleEditInputChange}
                  className={cn("bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": editErrors.companyName })}
                  placeholder="Nome da Empresa"
                />
                {editErrors.companyName && (
                  <p className="text-red-500 text-xs mt-1">Nome da empresa é obrigatório.</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="sm:text-right text-primary-foreground">
                Papel
              </Label>
              <div className="sm:col-span-3">
                <Select onValueChange={handleEditSelectChange} value={editedPartnerData.role}>
                  <SelectTrigger className={cn("bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": editErrors.role })}>
                    <SelectValue placeholder="Selecione o Papel" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-primary-foreground">
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {editErrors.role && (
                  <p className="text-red-500 text-xs mt-1">O papel é obrigatório.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" /> Detalhes de Contato
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="publicKey" className="sm:text-right text-primary-foreground">
                Chave Pública
              </Label>
              <div className="sm:col-span-3">
                <Input
                  id="publicKey"
                  value={editedPartnerData.publicKey}
                  onChange={handleEditInputChange}
                  className={cn("bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": editErrors.publicKey })}
                  placeholder="Chave Pública (Wallet)"
                />
                {editErrors.publicKey && (
                  <p className="text-red-500 text-xs mt-1">A chave pública é obrigatória.</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="sm:text-right text-primary-foreground">
                Email
              </Label>
              <div className="sm:col-span-3">
                <Input
                  id="email"
                  type="email"
                  value={editedPartnerData.email}
                  onChange={handleEditInputChange}
                  className={cn("bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": editErrors.email })}
                  placeholder="email@exemplo.com"
                />
                {editErrors.email && (
                  <p className="text-red-500 text-xs mt-1">O email é obrigatório.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="primary" onClick={handleSaveEdit}>
            Salvar Alterações
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={isDeleteConfirmModalOpen} onOpenChange={setIsDeleteConfirmModalOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary-foreground">Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Esta ação não pode ser desfeita. Isso removerá permanentemente o parceiro{" "}
              <span className="font-semibold text-primary-foreground">{partnerToDelete?.name}</span> da sua rede.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-muted-foreground hover:bg-slate-700 hover:text-primary-foreground">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Partners;