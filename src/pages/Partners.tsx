import React from 'react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User, Building2, Mail, KeyRound, ExternalLink, Edit, Trash2 } from 'lucide-react'; // Removed MoreHorizontal
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
import { roles } from '@/constants/stageFormSchemas'; // Import roles
import { PartnerRole } from '@/hooks/use-partners'; // Import PartnerRole type

// Mock data for partners
const mockPartnersInitial = [
  { id: 'p1', name: 'Café do Sol Ltda.', role: 'producer' as PartnerRole, email: 'contato@cafedosol.com', wallet: '0xabc...123' },
  { id: 'p2', name: 'Logística Rápida S.A.', role: 'logistics' as PartnerRole, email: 'info@lograpida.com', wallet: '0xdef...456' },
  { id: 'p3', name: 'Torrefação Aroma Fino', role: 'roaster' as PartnerRole, email: 'vendas@aromafino.com', wallet: '0xghi...789' },
];

const Partners: React.FC = () => {
  const isMobile = useIsMobile();
  const [partners, setPartners] = React.useState(mockPartnersInitial); // State to manage partners
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [addMethod, setAddMethod] = React.useState<'publicKey' | 'email'>('publicKey');
  const [newPartner, setNewPartner] = React.useState({
    companyName: '',
    publicKey: '',
    role: '' as PartnerRole, // Initialize with PartnerRole type
    email: '',
  });
  const [addErrors, setAddErrors] = React.useState<{ [key: string]: boolean }>({});

  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = React.useState(false);
  const [partnerToDelete, setPartnerToDelete] = React.useState<typeof mockPartnersInitial[0] | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [partnerToEdit, setPartnerToEdit] = React.useState<typeof mockPartnersInitial[0] | null>(null);
  const [editedPartnerData, setEditedPartnerData] = React.useState({
    id: '',
    companyName: '',
    publicKey: '',
    role: '' as PartnerRole, // Initialize with PartnerRole type
    email: '',
  });
  const [editErrors, setEditErrors] = React.useState<{ [key: string]: boolean }>({});

  // Helper to get role label from value
  const getRoleLabel = (roleValue: PartnerRole) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  // --- Add Partner Logic ---
  const handleAddInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewPartner((prev) => ({ ...prev, [id]: value }));
    setAddErrors((prev) => ({ ...prev, [id]: false }));
  };

  const handleAddSelectChange = (value: PartnerRole) => { // Use PartnerRole type
    setNewPartner((prev) => ({ ...prev, role: value }));
    setAddErrors((prev) => ({ ...prev, role: false }));
  };

  const validateAddForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!newPartner.companyName) newErrors.companyName = true;
    if (!newPartner.role) newErrors.role = true;

    if (addMethod === 'publicKey') {
      if (!newPartner.publicKey) newErrors.publicKey = true;
    } else {
      if (!newPartner.email) newErrors.email = true;
    }
    setAddErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPartner = () => {
    if (!validateAddForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    const newId = `p${partners.length + 1}`;
    const partnerToAdd = {
      id: newId,
      name: newPartner.companyName,
      role: newPartner.role,
      email: newPartner.email,
      wallet: newPartner.publicKey,
    };
    setPartners((prev) => [...prev, partnerToAdd]);
    toast.success("Parceiro adicionado com sucesso!");
    setIsAddModalOpen(false);
    setNewPartner({ companyName: '', publicKey: '', role: '' as PartnerRole, email: '' });
    setAddErrors({});
  };

  // --- Delete Partner Logic ---
  const handleDeleteClick = (partner: typeof mockPartnersInitial[0]) => {
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

  // --- Edit Partner Logic ---
  const handleEditClick = (partner: typeof mockPartnersInitial[0]) => {
    setPartnerToEdit(partner);
    setEditedPartnerData({
      id: partner.id,
      companyName: partner.name,
      publicKey: partner.wallet,
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

  const handleEditSelectChange = (value: PartnerRole) => { // Use PartnerRole type
    setEditedPartnerData((prev) => ({ ...prev, role: value }));
    setEditErrors((prev) => ({ ...prev, role: false }));
  };

  const validateEditForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!editedPartnerData.companyName) newErrors.companyName = true;
    if (!editedPartnerData.role) newErrors.role = true;
    if (!editedPartnerData.publicKey && !editedPartnerData.email) { // At least one identifier is needed
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
              wallet: editedPartnerData.publicKey,
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
        <Button variant="primary" onClick={() => setIsAddModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Adicionar Parceiro</span>
        </Button>
      </div>

      {isMobile ? (
        // Mobile view: Cards
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <Card key={partner.id} className="p-6 flex flex-col items-center text-center space-y-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {partner.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-primary-foreground">{partner.name}</h3>
              <p className="text-muted-foreground">{getRoleLabel(partner.role)}</p> {/* Display label */}
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
        // Desktop view: Table
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
                    <TableCell className="text-slate-400">{getRoleLabel(partner.role)}</TableCell> {/* Display label */}
                    <TableCell className="text-slate-400">{partner.email}</TableCell>
                    <TableCell className="font-mono text-slate-300">{partner.wallet}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewProfileClick(partner.name)} className="hover:bg-slate-700"> {/* Removed text-amber-500 */}
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
      )}

      {/* Add Partner Modal */}
      <Modal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Adicionar Novo Parceiro"
        description="Preencha os detalhes para adicionar um novo parceiro à sua rede."
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
                  value={newPartner.companyName}
                  onChange={handleAddInputChange}
                  className={cn("bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": addErrors.companyName })}
                  placeholder="Nome da Empresa"
                />
                {addErrors.companyName && (
                  <p className="text-red-500 text-xs mt-1">Nome da empresa é obrigatório.</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="sm:text-right text-primary-foreground">
                Papel
              </Label>
              <div className="sm:col-span-3">
                <Select onValueChange={handleAddSelectChange} value={newPartner.role}>
                  <SelectTrigger className={cn("bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": addErrors.role })}>
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
                {addErrors.role && (
                  <p className="text-red-500 text-xs mt-1">O papel é obrigatório.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary-foreground flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" /> Método de Adição
            </h3>
            <Tabs defaultValue="publicKey" className="w-full" onValueChange={(value) => setAddMethod(value as 'publicKey' | 'email')}>
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
                  <Label htmlFor="publicKey" className="sm:text-right text-primary-foreground">
                    Chave Pública
                  </Label>
                  <div className="sm:col-span-3">
                    <Input
                      id="publicKey"
                      value={newPartner.publicKey}
                      onChange={handleAddInputChange}
                      className={cn("bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": addErrors.publicKey })}
                      placeholder="Chave Pública (Wallet)"
                    />
                    {addErrors.publicKey && (
                      <p className="text-red-500 text-xs mt-1">A chave pública é obrigatória.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="email" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="sm:text-right text-primary-foreground">
                    Email
                  </Label>
                  <div className="sm:col-span-3">
                    <Input
                      id="email"
                      type="email"
                      value={newPartner.email}
                      onChange={handleAddInputChange}
                      className={cn("bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": addErrors.email })}
                      placeholder="email@exemplo.com"
                    />
                    {addErrors.email && (
                      <p className="text-red-500 text-xs mt-1">O email é obrigatório.</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button variant="primary" onClick={handleAddPartner}>
            Adicionar Parceiro
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