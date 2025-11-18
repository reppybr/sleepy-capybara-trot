"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Factory, Truck, Globe, Image, Mail, Phone, User, Lock, Wallet, Clock, Save, Bell } from 'lucide-react';
import { roles } from '@/constants/stageFormSchemas'; // Import roles array
import { PartnerRole } from '@/hooks/use-partners'; // Import PartnerRole type

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  // Mock states for Brand Owner
  const [brandName, setBrandName] = useState(user?.role === 'brand_owner' ? 'Café do Futuro' : '');
  const [brandStory, setBrandStory] = useState(user?.role === 'brand_owner' ? 'Nossa fazenda cultiva cafés especiais com paixão e tradição, garantindo qualidade e sustentabilidade em cada grão.' : '');
  const [website, setWebsite] = useState(user?.role === 'brand_owner' ? 'https://www.cafedofuturo.com' : '');
  const [logoUrl, setLogoUrl] = useState(user?.role === 'brand_owner' ? '/public/placeholder.svg' : '');

  // Mock states for Worker/Partner
  const [companyName, setCompanyName] = useState(user?.role !== 'brand_owner' ? 'TransCafé Logística' : '');
  const [serviceType, setServiceType] = useState<PartnerRole>(user?.role !== 'brand_owner' ? 'logistics' : '' as PartnerRole); // Use PartnerRole type
  const [operationalEmail, setOperationalEmail] = useState(user?.role !== 'brand_owner' ? 'ops@transcafe.com' : '');
  const [technicalResponsible, setTechnicalResponsible] = useState(user?.role !== 'brand_owner' ? 'Maria Oliveira' : '');

  // Mock states for Notifications
  const [systemAlerts, setSystemAlerts] = useState(true);
  const [platformNews, setPlatformNews] = useState(true);
  const [batchFinalizedNotification, setBatchFinalizedNotification] = useState(true);
  const [monthlyReport, setMonthlyReport] = useState(false);
  const [custodyReceivedNotification, setCustodyReceivedNotification] = useState(true);
  const [delayAlerts, setDelayAlerts] = useState(true);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    toast.loading("Salvando dados do perfil...", { id: "save-profile" });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    toast.success("Dados do perfil atualizados!", { id: "save-profile" });
    setIsSaving(false);
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    toast.loading("Salvando preferências de notificação...", { id: "save-notifications" });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    toast.success("Preferências de notificação atualizadas!", { id: "save-notifications" });
    setIsSaving(false);
  };

  const handleDisconnectWallet = () => {
    toast.info("Funcionalidade de desconectar carteira em desenvolvimento.");
    // In a real app, this would trigger a wallet disconnect action
  };

  const handleLogout = () => {
    logout();
    toast.success("Você foi desconectado.");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">Por favor, faça login para acessar as configurações.</p>
      </div>
    );
  }

  // Filter roles relevant for a partner's service type (excluding brand_owner)
  const partnerServiceRoles = roles.filter(role => role.value !== 'brand_owner');

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-primary-foreground">Configurações</h1>
        <p className="text-md text-slate-400 mt-1">Gerencie seus dados e preferências.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-border">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="h-4 w-4 mr-2" /> Perfil & Dados
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="h-4 w-4 mr-2" /> Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Lock className="h-4 w-4 mr-2" /> Segurança
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Perfil & Dados */}
        <TabsContent value="profile" className="mt-6">
          <Card className="p-6 space-y-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
            {user.role === 'brand_owner' ? (
              // Brand Owner Profile
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2">
                  <Factory className="h-5 w-5 text-primary" /> Identidade da Marca (Visível ao Consumidor)
                </h2>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="brandName" className="sm:text-right text-primary-foreground">Nome da Marca</Label>
                    <Input
                      id="brandName"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="sm:col-span-3 bg-slate-700 border-slate-600 text-primary-foreground"
                      placeholder="Ex: Café do Futuro"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-4">
                    <Label htmlFor="brandStory" className="sm:text-right text-primary-foreground">História / Bio</Label>
                    <Textarea
                      id="brandStory"
                      value={brandStory}
                      onChange={(e) => setBrandStory(e.target.value)}
                      className="sm:col-span-3 bg-slate-700 border-slate-600 text-primary-foreground min-h-[100px]"
                      placeholder="Conte a história da sua fazenda, seus valores e o que torna seu café especial..."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="website" className="sm:text-right text-primary-foreground flex items-center gap-1">
                      <Globe className="h-4 w-4 text-slate-500" /> Website Oficial
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="sm:col-span-3 bg-slate-700 border-slate-600 text-primary-foreground"
                      placeholder="https://www.suamarca.com.br"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="logoUrl" className="sm:text-right text-primary-foreground flex items-center gap-1">
                      <Image className="h-4 w-4 text-slate-500" /> Logo Pública
                    </Label>
                    <div className="sm:col-span-3 flex items-center gap-2">
                      <Input
                        id="logoUrl"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="flex-grow bg-slate-700 border-slate-600 text-primary-foreground"
                        placeholder="URL da sua logo (Ex: https://exemplo.com/logo.png)"
                      />
                      {/* Placeholder for actual image upload */}
                      <Button variant="secondary" size="sm" className="shrink-0">Upload</Button>
                    </div>
                    <p className="sm:col-start-2 sm:col-span-3 text-xs text-muted-foreground mt-1">
                      Aparecerá no cabeçalho da página pública do lote.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Worker/Partner Profile
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" /> Dados Operacionais (Visível para a Marca)
                </h2>
                <p className="text-muted-foreground">Mantenha seus dados de contato atualizados para agilizar a logística.</p>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="companyName" className="sm:text-right text-primary-foreground">Nome da Empresa / Operador</Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="sm:col-span-3 bg-slate-700 border-slate-600 text-primary-foreground"
                      placeholder="Ex: TransCafé Logística"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="serviceType" className="sm:text-right text-primary-foreground">Tipo de Serviço</Label>
                    <Select onValueChange={(value: PartnerRole) => setServiceType(value)} value={serviceType}>
                      <SelectTrigger className="sm:col-span-3 bg-slate-700 border-slate-600 text-primary-foreground">
                        <SelectValue placeholder="Selecione o Tipo de Serviço" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-primary-foreground">
                        {partnerServiceRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="operationalEmail" className="sm:text-right text-primary-foreground flex items-center gap-1">
                      <Mail className="h-4 w-4 text-slate-500" /> Email de Contato Operacional
                    </Label>
                    <Input
                      id="operationalEmail"
                      type="email"
                      value={operationalEmail}
                      onChange={(e) => setOperationalEmail(e.target.value)}
                      className="sm:col-span-3 bg-slate-700 border-slate-600 text-primary-foreground"
                      placeholder="ops@suaempresa.com"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <Label htmlFor="technicalResponsible" className="sm:text-right text-primary-foreground flex items-center gap-1">
                      <User className="h-4 w-4 text-slate-500" /> Responsável Técnico
                    </Label>
                    <Input
                      id="technicalResponsible"
                      value={technicalResponsible}
                      onChange={(e) => setTechnicalResponsible(e.target.value)}
                      className="sm:col-span-3 bg-slate-700 border-slate-600 text-primary-foreground"
                      placeholder="Nome do motorista ou gerente"
                    />
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end pt-4">
              <Button variant="primary" onClick={handleSaveProfile} disabled={isSaving}>
                {isSaving ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Salvando...</span>
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 2: Notificações */}
        <TabsContent value="notifications" className="mt-6">
          <Card className="p-6 space-y-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
            <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" /> Preferências de Notificação
            </h2>
            <div className="grid gap-6">
              {/* Shared Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-primary-foreground">Geral</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="system-alerts" className="text-muted-foreground">Alertas de Sistema</Label>
                  <Switch
                    id="system-alerts"
                    checked={systemAlerts}
                    onCheckedChange={setSystemAlerts}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="platform-news" className="text-muted-foreground">Novidades da Plataforma</Label>
                  <Switch
                    id="platform-news"
                    checked={platformNews}
                    onCheckedChange={setPlatformNews}
                    className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
                  />
                </div>
              </div>

              {/* Role-Specific Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-primary-foreground">Específicas do Papel</h3>
                {user.role === 'brand_owner' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="batch-finalized" className="text-muted-foreground">Notificar quando um Lote for Finalizado</Label>
                      <Switch
                        id="batch-finalized"
                        checked={batchFinalizedNotification}
                        onCheckedChange={setBatchFinalizedNotification}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="monthly-report" className="text-muted-foreground">Relatório Mensal de Produção</Label>
                      <Switch
                        id="monthly-report"
                        checked={monthlyReport}
                        onCheckedChange={setMonthlyReport}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="custody-received" className="text-muted-foreground">Notificar quando receber custódia de Lote</Label>
                      <Switch
                        id="custody-received"
                        checked={custodyReceivedNotification}
                        onCheckedChange={setCustodyReceivedNotification}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="delay-alerts" className="text-muted-foreground">Alertas de Atraso / Pendências</Label>
                      <Switch
                        id="delay-alerts"
                        checked={delayAlerts}
                        onCheckedChange={setDelayAlerts}
                        className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-slate-600"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button variant="primary" onClick={handleSaveNotifications} disabled={isSaving}>
                {isSaving ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Salvando...</span>
                  </span>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    <span>Salvar Preferências</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* Tab 3: Segurança */}
        <TabsContent value="security" className="mt-6">
          <Card className="p-6 space-y-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
            <h2 className="text-xl font-semibold text-primary-foreground flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" /> Segurança da Conta
            </h2>
            <div className="grid gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-slate-500" />
                <span className="font-medium text-primary-foreground">Carteira Conectada:</span>
                <span className="font-mono text-sm">{user.public_key}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-500" />
                <span className="font-medium text-primary-foreground">Último Login:</span>
                <span>{new Date().toLocaleString('pt-BR')} (Mock IP: 192.168.1.1)</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="secondary" onClick={handleDisconnectWallet} className="w-full sm:w-auto">
                Desconectar Carteira
              </Button>
              <Button variant="danger" onClick={handleLogout} className="w-full sm:w-auto">
                Sair da Conta
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;