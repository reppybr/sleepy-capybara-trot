"use client";

import React, { useState } from 'react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, User, Users, Building2, Mail, KeyRound, ExternalLink, UserPlus, Check, X, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { roles } from '@/constants/roles';
import { PartnerRole, Partner } from '@/hooks/use-partners';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyPartners, getConnectionRequests, createConnectionRequest, updateConnectionRequestStatus } from '@/api/partnerService';
import { assignUserRole } from '@/api/userService';

const Partners: React.FC = () => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const { profile: user } = useSupabaseAuth();

  // --- Data Fetching using React Query ---
  const { data: partners = [], isLoading: isLoadingPartners } = useQuery({
    queryKey: ['myPartners'],
    queryFn: getMyPartners,
    enabled: !!user,
  });

  const { data: incomingRequests = [], isLoading: isLoadingIncoming } = useQuery({
    queryKey: ['connectionRequests', 'incoming'],
    queryFn: () => getConnectionRequests('incoming'),
    enabled: !!user,
  });

  const { data: sentRequests = [], isLoading: isLoadingSent } = useQuery({
    queryKey: ['connectionRequests', 'sent'],
    queryFn: () => getConnectionRequests('sent'),
    enabled: !!user,
  });

  // --- State for Modals ---
  const [isSendRequestModalOpen, setIsSendRequestModalOpen] = useState(false);
  const [isCreatePartnerModalOpen, setIsCreatePartnerModalOpen] = useState(false);

  // --- State for Forms ---
  const [newRequestData, setNewRequestData] = useState({ recipient_public_key: '', message: '' });
  const [newPartnerData, setNewPartnerData] = useState({ identifier: '', identifierMethod: 'publicKey' as 'publicKey' | 'email', role: '' as PartnerRole, name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getRoleLabel = (roleValue: PartnerRole) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  const handleConnectClick = () => {
    if (user?.role === 'brand_owner') {
      setIsCreatePartnerModalOpen(true);
    } else {
      setIsSendRequestModalOpen(true);
    }
  };

  // --- Mutations ---
  const assignRoleMutation = useMutation({
    mutationFn: assignUserRole,
    onSuccess: (data) => {
      toast.success(`Parceiro "${data.user.name}" agora é um ${getRoleLabel(data.user.role as PartnerRole)}!`);
      queryClient.invalidateQueries({ queryKey: ['myPartners'] });
      setIsCreatePartnerModalOpen(false);
      setNewPartnerData({ identifier: '', identifierMethod: 'publicKey', role: '' as PartnerRole, name: '' });
    },
    onError: (error: Error) => {
      toast.error(`Falha ao atribuir papel: ${error.message}`);
    },
    onSettled: () => setIsSubmitting(false),
  });

  const sendRequestMutation = useMutation({
    mutationFn: createConnectionRequest,
    onSuccess: () => {
      toast.success("Solicitação de conexão enviada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['connectionRequests', 'sent'] });
      setIsSendRequestModalOpen(false);
      setNewRequestData({ recipient_public_key: '', message: '' });
    },
    onError: (error: Error) => {
      toast.error(`Falha ao enviar solicitação: ${error.message}`);
    },
    onSettled: () => setIsSubmitting(false),
  });

  const updateRequestMutation = useMutation({
    mutationFn: updateConnectionRequestStatus,
    onSuccess: (_, variables) => {
      toast.success(`Solicitação ${variables.status === 'accepted' ? 'aceita' : 'rejeitada'}!`);
      queryClient.invalidateQueries({ queryKey: ['connectionRequests', 'incoming'] });
      queryClient.invalidateQueries({ queryKey: ['myPartners'] });
    },
    onError: (error: Error) => {
      toast.error(`Falha ao processar solicitação: ${error.message}`);
    },
  });

  // --- Form Handlers ---
  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerData.identifier.trim() || !newPartnerData.role) {
      toast.error("Por favor, preencha o identificador e o papel do parceiro.");
      return;
    }
    setIsSubmitting(true);
    assignRoleMutation.mutate({
      identifier: newPartnerData.identifier,
      method: newPartnerData.identifierMethod,
      role: newPartnerData.role,
    });
  };

  const handleSendConnectionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequestData.recipient_public_key.trim()) {
      toast.error("Por favor, preencha a chave pública do destinatário.");
      return;
    }
    setIsSubmitting(true);
    sendRequestMutation.mutate(newRequestData);
  };

  const handleUpdateRequest = (id: string, status: 'accepted' | 'rejected') => {
    updateRequestMutation.mutate({ id, status });
  };

  const isLoading = isLoadingPartners || isLoadingIncoming || isLoadingSent;

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-foreground">Minha Rede de Parceiros</h1>
        <Button variant="primary" onClick={handleConnectClick} className="flex items-center space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Conectar com Parceiro</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="myNetwork" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
            <TabsTrigger value="myNetwork" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="h-4 w-4 mr-2" /> Minha Rede ({partners.length})
            </TabsTrigger>
            <TabsTrigger value="incomingRequests" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" /> Recebidas ({incomingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sentRequests" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Clock className="h-4 w-4 mr-2" /> Enviadas ({sentRequests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="myNetwork" className="mt-6">
            {partners.length > 0 ? (
              isMobile ? (
                <section className="grid grid-cols-1 gap-6">
                  {partners.map((partner) => (
                    <Card key={partner.id} className="p-6 flex flex-col items-center text-center space-y-4">
                      <Avatar className="h-16 w-16"><AvatarFallback className="bg-primary text-primary-foreground text-xl">{partner.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback></Avatar>
                      <h3 className="text-xl font-semibold text-primary-foreground">{partner.name}</h3>
                      <p className="text-muted-foreground">{getRoleLabel(partner.role)}</p>
                    </Card>
                  ))}
                </section>
              ) : (
                <Card className="p-0 bg-slate-800/60 backdrop-blur-md border border-slate-700">
                  <Table>
                    <TableHeader className="bg-slate-900/50"><TableRow><TableHead>Empresa</TableHead><TableHead>Papel</TableHead><TableHead>Email</TableHead><TableHead>Chave Pública</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {partners.map((partner) => (
                        <TableRow key={partner.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                          <TableCell className="font-medium text-primary-foreground">{partner.name}</TableCell>
                          <TableCell className="text-slate-400">{getRoleLabel(partner.role)}</TableCell>
                          <TableCell className="text-slate-400">{partner.email}</TableCell>
                          <TableCell className="font-mono text-slate-300">{partner.public_key}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )
            ) : (
              <Card className="p-8 text-center flex flex-col items-center justify-center space-y-4"><Users className="h-20 w-20 text-slate-600" /><h3 className="text-xl font-semibold">Sua rede está vazia.</h3><p className="text-muted-foreground">Conecte-se com parceiros para começar.</p></Card>
            )}
          </TabsContent>

          <TabsContent value="incomingRequests" className="mt-6">
            {incomingRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {incomingRequests.map((req) => (
                  <Card key={req.id} className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12"><AvatarFallback className="bg-blue-500 text-white">{req.sender.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback></Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{req.sender.name}</h3>
                        <p className="text-sm text-muted-foreground">{getRoleLabel(req.sender.role as PartnerRole)}</p>
                      </div>
                    </div>
                    {req.message && <p className="text-sm italic border-l-2 pl-3">"{req.message}"</p>}
                    <div className="flex justify-end space-x-2">
                      <Button variant="secondary" size="sm" onClick={() => handleUpdateRequest(req.id, 'rejected')}><X className="h-4 w-4 mr-2" /> Rejeitar</Button>
                      <Button variant="primary" size="sm" onClick={() => handleUpdateRequest(req.id, 'accepted')}><Check className="h-4 w-4 mr-2" /> Aceitar</Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center"><UserPlus className="h-20 w-20 mx-auto text-slate-600" /><h3 className="text-xl font-semibold mt-4">Nenhuma solicitação pendente.</h3></Card>
            )}
          </TabsContent>

          <TabsContent value="sentRequests" className="mt-6">
            {sentRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sentRequests.map((req) => (
                  <Card key={req.id} className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12"><AvatarFallback className="bg-purple-500 text-white">{req.recipient.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback></Avatar>
                      <div>
                        <h3 className="text-lg font-semibold">{req.recipient.name}</h3>
                        <p className="text-sm text-muted-foreground">{getRoleLabel(req.recipient.role as PartnerRole)}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn("px-3 py-1 rounded-full text-xs", req.status === 'pending' && "bg-amber-500/20 text-amber-400", req.status === 'accepted' && "bg-emerald-500/20 text-emerald-400", req.status === 'rejected' && "bg-red-500/20 text-red-400")}>
                        {req.status}
                      </span>
                      <p className="text-xs text-muted-foreground">{new Date(req.created_at).toLocaleDateString()}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center"><Clock className="h-20 w-20 mx-auto text-slate-600" /><h3 className="text-xl font-semibold mt-4">Nenhuma solicitação enviada.</h3></Card>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Modals */}
      <Modal open={isCreatePartnerModalOpen} onOpenChange={setIsCreatePartnerModalOpen} title="Atribuir Papel a Parceiro" description="Atribua um papel a um usuário existente na plataforma.">
        <form onSubmit={handleCreatePartner} className="grid gap-6 py-4">
          <Tabs defaultValue="publicKey" className="w-full" onValueChange={(v) => setNewPartnerData(p => ({...p, identifierMethod: v as 'publicKey' | 'email', identifier: ''}))}>
            <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="publicKey">Chave Pública</TabsTrigger><TabsTrigger value="email">Email</TabsTrigger></TabsList>
            <TabsContent value="publicKey" className="mt-4"><Label htmlFor="identifier-pk">Chave Pública</Label><Input id="identifier-pk" value={newPartnerData.identifier} onChange={(e) => setNewPartnerData(p => ({...p, identifier: e.target.value}))} /></TabsContent>
            <TabsContent value="email" className="mt-4"><Label htmlFor="identifier-email">Email</Label><Input id="identifier-email" type="email" value={newPartnerData.identifier} onChange={(e) => setNewPartnerData(p => ({...p, identifier: e.target.value}))} /></TabsContent>
          </Tabs>
          <div><Label htmlFor="role">Papel a Atribuir</Label><Select onValueChange={(v: PartnerRole) => setNewPartnerData(p => ({...p, role: v}))}><SelectTrigger><SelectValue placeholder="Selecione o Papel" /></SelectTrigger><SelectContent>{roles.filter(r => r.value !== 'brand_owner').map(role => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}</SelectContent></Select></div>
          <div className="flex justify-end mt-6"><Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Atribuindo...</> : 'Atribuir Papel'}</Button></div>
        </form>
      </Modal>

      <Modal open={isSendRequestModalOpen} onOpenChange={setIsSendRequestModalOpen} title="Enviar Solicitação de Conexão" description="Conecte-se com outro parceiro na rede.">
        <form onSubmit={handleSendConnectionRequest} className="grid gap-6 py-4">
          <div><Label htmlFor="recipient_public_key">Chave Pública do Destinatário</Label><Input id="recipient_public_key" value={newRequestData.recipient_public_key} onChange={(e) => setNewRequestData(p => ({...p, recipient_public_key: e.target.value}))} /></div>
          <div><Label htmlFor="message">Mensagem (Opcional)</Label><Textarea id="message" value={newRequestData.message} onChange={(e) => setNewRequestData(p => ({...p, message: e.target.value}))} /></div>
          <div className="flex justify-end mt-6"><Button type="submit" variant="primary" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Enviando...</> : 'Enviar Solicitação'}</Button></div>
        </form>
      </Modal>
    </div>
  );
};

export default Partners;