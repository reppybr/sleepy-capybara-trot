"use client";

import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Factory, Truck, Globe, Image, Mail, Phone, User, Lock, Wallet, Clock, Save, Bell, Loader2 } from 'lucide-react';
import { roles } from '@/constants/roles';
import { PartnerRole } from '@/hooks/use-partners';
import placeholderLogo from '@/assets/placeholder.svg';
import { updateMyProfile } from '@/api/userService';

const Settings: React.FC = () => {
  const { profile: user, setProfile, session, signOut: logout } = useSupabaseAuth();

  // State for form data
  const [profileData, setProfileData] = useState<any>({});
  const [notificationPrefs, setNotificationPrefs] = useState<any>({});

  useEffect(() => {
    if (user) {
      const metadata = user.profile_metadata || {};
      setProfileData({
        // Common
        name: user.name || '',
        // Brand Owner specific
        brandStory: metadata.brandStory || '',
        website: metadata.website || '',
        logoUrl: metadata.logoUrl || placeholderLogo,
        // Partner specific
        serviceType: user.role || '',
        operationalEmail: metadata.operationalEmail || '',
        technicalResponsible: metadata.technicalResponsible || '',
      });
      setNotificationPrefs({
        systemAlerts: metadata.notifications?.systemAlerts ?? true,
        platformNews: metadata.notifications?.platformNews ?? true,
        batchFinalizedNotification: metadata.notifications?.batchFinalizedNotification ?? true,
        monthlyReport: metadata.notifications?.monthlyReport ?? false,
        custodyReceivedNotification: metadata.notifications?.custodyReceivedNotification ?? true,
        delayAlerts: metadata.notifications?.delayAlerts ?? true,
      });
    }
  }, [user]);

  const handleProfileChange = (field: string, value: any) => {
    setProfileData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationPrefs((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateProfileMutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (data) => {
      toast.success("Dados atualizados com sucesso!");
      setProfile(data.user); // Update global profile state
    },
    onError: (error: Error) => {
      toast.error(`Falha ao atualizar: ${error.message}`);
    },
  });

  const handleSaveProfile = () => {
    if (!user) return;
    const { name, ...metadataFields } = profileData;
    const payload = {
      name: name,
      profile_metadata: {
        ...user.profile_metadata,
        ...metadataFields,
      },
    };
    updateProfileMutation.mutate(payload);
  };

  const handleSaveNotifications = () => {
    if (!user) return;
    const payload = {
      profile_metadata: {
        ...user.profile_metadata,
        notifications: notificationPrefs,
      },
    };
    updateProfileMutation.mutate(payload);
  };

  const handleLogout = () => {
    logout();
    toast.success("Você foi desconectado.");
  };

  if (!user || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">Carregando dados do usuário...</p>
      </div>
    );
  }

  const partnerServiceRoles = roles.filter(role => role.value !== 'brand_owner');

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-3xl font-bold text-primary-foreground">Configurações</h1>
        <p className="text-md text-slate-400 mt-1">Gerencie seus dados e preferências.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><User className="h-4 w-4 mr-2" /> Perfil & Dados</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Bell className="h-4 w-4 mr-2" /> Notificações</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Lock className="h-4 w-4 mr-2" /> Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="p-6 space-y-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
            {user.role === 'brand_owner' ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2"><Factory className="h-5 w-5 text-primary" /> Identidade da Marca</h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="brandName" className="sm:text-right text-primary-foreground">Nome da Marca</Label>
                    <Input id="brandName" value={profileData.name || ''} onChange={(e) => handleProfileChange('name', e.target.value)} className="sm:col-span-3 bg-slate-700 border-slate-600" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
                    <Label htmlFor="brandStory" className="sm:text-right text-primary-foreground">História / Bio</Label>
                    <Textarea id="brandStory" value={profileData.brandStory || ''} onChange={(e) => handleProfileChange('brandStory', e.target.value)} className="sm:col-span-3 bg-slate-700 border-slate-600 min-h-[100px]" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="website" className="sm:text-right text-primary-foreground flex items-center gap-1"><Globe className="h-4 w-4 text-slate-500" /> Website</Label>
                    <Input id="website" type="url" value={profileData.website || ''} onChange={(e) => handleProfileChange('website', e.target.value)} className="sm:col-span-3 bg-slate-700 border-slate-600" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="logoUrl" className="sm:text-right text-primary-foreground flex items-center gap-1"><Image className="h-4 w-4 text-slate-500" /> Logo</Label>
                    <Input id="logoUrl" value={profileData.logoUrl || ''} onChange={(e) => handleProfileChange('logoUrl', e.target.value)} className="sm:col-span-3 bg-slate-700 border-slate-600" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> Dados Operacionais</h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="companyName" className="sm:text-right text-primary-foreground">Nome da Empresa</Label>
                    <Input id="companyName" value={profileData.name || ''} onChange={(e) => handleProfileChange('name', e.target.value)} className="sm:col-span-3 bg-slate-700 border-slate-600" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="serviceType" className="sm:text-right text-primary-foreground">Tipo de Serviço</Label>
                    <Select onValueChange={(value: PartnerRole) => handleProfileChange('serviceType', value)} value={profileData.serviceType || ''}>
                      <SelectTrigger className="sm:col-span-3 bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">{partnerServiceRoles.map((role) => <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="operationalEmail" className="sm:text-right text-primary-foreground flex items-center gap-1"><Mail className="h-4 w-4 text-slate-500" /> Email Operacional</Label>
                    <Input id="operationalEmail" type="email" value={profileData.operationalEmail || ''} onChange={(e) => handleProfileChange('operationalEmail', e.target.value)} className="sm:col-span-3 bg-slate-700 border-slate-600" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="technicalResponsible" className="sm:text-right text-primary-foreground flex items-center gap-1"><User className="h-4 w-4 text-slate-500" /> Responsável Técnico</Label>
                    <Input id="technicalResponsible" value={profileData.technicalResponsible || ''} onChange={(e) => handleProfileChange('technicalResponsible', e.target.value)} className="sm:col-span-3 bg-slate-700 border-slate-600" />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end pt-4">
              <Button variant="primary" onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</> : <><Save className="h-4 w-4 mr-2" /> Salvar Alterações</>}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="p-6 space-y-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
            <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2"><Bell className="h-5 w-5 text-primary" /> Preferências de Notificação</h2>
            <div className="grid gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Geral</h3>
                <div className="flex items-center justify-between"><Label htmlFor="system-alerts" className="text-muted-foreground">Alertas de Sistema</Label><Switch id="system-alerts" checked={notificationPrefs.systemAlerts} onCheckedChange={(c) => handleNotificationChange('systemAlerts', c)} /></div>
                <div className="flex items-center justify-between"><Label htmlFor="platform-news" className="text-muted-foreground">Novidades da Plataforma</Label><Switch id="platform-news" checked={notificationPrefs.platformNews} onCheckedChange={(c) => handleNotificationChange('platformNews', c)} /></div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Específicas do Papel</h3>
                {user.role === 'brand_owner' ? (
                  <>
                    <div className="flex items-center justify-between"><Label htmlFor="batch-finalized" className="text-muted-foreground">Lote Finalizado</Label><Switch id="batch-finalized" checked={notificationPrefs.batchFinalizedNotification} onCheckedChange={(c) => handleNotificationChange('batchFinalizedNotification', c)} /></div>
                    <div className="flex items-center justify-between"><Label htmlFor="monthly-report" className="text-muted-foreground">Relatório Mensal</Label><Switch id="monthly-report" checked={notificationPrefs.monthlyReport} onCheckedChange={(c) => handleNotificationChange('monthlyReport', c)} /></div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between"><Label htmlFor="custody-received" className="text-muted-foreground">Custódia de Lote Recebida</Label><Switch id="custody-received" checked={notificationPrefs.custodyReceivedNotification} onCheckedChange={(c) => handleNotificationChange('custodyReceivedNotification', c)} /></div>
                    <div className="flex items-center justify-between"><Label htmlFor="delay-alerts" className="text-muted-foreground">Alertas de Atraso / Pendências</Label><Switch id="delay-alerts" checked={notificationPrefs.delayAlerts} onCheckedChange={(c) => handleNotificationChange('delayAlerts', c)} /></div>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="primary" onClick={handleSaveNotifications} disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Salvando...</> : <><Save className="h-4 w-4 mr-2" /> Salvar Preferências</>}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="p-6 space-y-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
            <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Segurança da Conta</h2>
            <div className="grid gap-4 text-muted-foreground">
              <div className="flex items-center gap-2"><Wallet className="h-4 w-4 text-slate-500" /><span className="font-medium text-primary-foreground">Carteira Conectada:</span><span className="font-mono text-sm">{user.public_key}</span></div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-500" /><span className="font-medium text-primary-foreground">Último Login:</span><span>{session.user.last_sign_in_at ? new Date(session.user.last_sign_in_at).toLocaleString('pt-BR') : 'N/A'}</span></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="danger" onClick={handleLogout} className="w-full sm:w-auto">Sair da Conta</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;