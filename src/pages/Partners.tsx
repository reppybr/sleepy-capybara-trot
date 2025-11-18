import React from 'react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, User, Building2, Mail, KeyRound, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils'; // Import cn utility

// Mock data for partners
const mockPartners = [
  { id: 'p1', name: 'Café do Sol Ltda.', role: 'Produtor', email: 'contato@cafedosol.com', wallet: '0xabc...123' },
  { id: 'p2', name: 'Logística Rápida S.A.', role: 'Transportadora', email: 'info@lograpida.com', wallet: '0xdef...456' },
  { id: 'p3', name: 'Torrefação Aroma Fino', role: 'Torrefador', email: 'vendas@aromafino.com', wallet: '0xghi...789' },
];

const Partners: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newPartner, setNewPartner] = React.useState({
    companyName: '',
    publicKey: '',
    role: '',
    email: '',
  });
  const [errors, setErrors] = React.useState<{ [key: string]: boolean }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewPartner((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: false })); // Clear error on change
  };

  const handleSelectChange = (value: string) => {
    setNewPartner((prev) => ({ ...prev, role: value }));
    setErrors((prev) => ({ ...prev, role: false })); // Clear error on change
  };

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!newPartner.companyName) newErrors.companyName = true;
    if (!newPartner.publicKey) newErrors.publicKey = true;
    if (!newPartner.role) newErrors.role = true;
    if (!newPartner.email) newErrors.email = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPartner = () => {
    if (!validateForm()) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    // Simulate adding partner
    console.log('Adicionar Parceiro:', newPartner);
    toast.success("Parceiro adicionado com sucesso!");
    setIsModalOpen(false);
    setNewPartner({ companyName: '', publicKey: '', role: '', email: '' }); // Reset form
    setErrors({});
  };

  return (
    <div className="space-y-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-foreground">Minha Rede de Parceiros</h1>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Adicionar Parceiro</span>
        </Button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockPartners.map((partner) => (
          <Card key={partner.id} className="p-6 flex flex-col items-center text-center space-y-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {partner.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold text-primary-foreground">{partner.name}</h3>
            <p className="text-muted-foreground">{partner.role}</p>
            <a
              href="#"
              className="text-primary hover:underline flex items-center space-x-1 transition-colors"
              onClick={(e) => { e.preventDefault(); toast.info(`Visualizando perfil de ${partner.name}`); }}
            >
              <span>Ver Perfil</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </Card>
        ))}
      </section>

      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Adicionar Novo Parceiro"
        description="Preencha os detalhes para adicionar um novo parceiro à sua rede."
      >
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="companyName" className="text-right text-primary-foreground">
              Empresa
            </Label>
            <Input
              id="companyName"
              value={newPartner.companyName}
              onChange={handleInputChange}
              className={cn("col-span-3 bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": errors.companyName })}
              placeholder="Nome da Empresa"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="publicKey" className="text-right text-primary-foreground">
              Chave Pública
            </Label>
            <Input
              id="publicKey"
              value={newPartner.publicKey}
              onChange={handleInputChange}
              className={cn("col-span-3 bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": errors.publicKey })}
              placeholder="Chave Pública (Wallet)"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right text-primary-foreground">
              Papel
            </Label>
            <Select onValueChange={handleSelectChange} value={newPartner.role}>
              <SelectTrigger className={cn("col-span-3 bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": errors.role })}>
                <SelectValue placeholder="Selecione o Papel" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-primary-foreground">
                <SelectItem value="Produtor">Produtor</SelectItem>
                <SelectItem value="Torrefador">Torrefador</SelectItem>
                <SelectItem value="Transportadora">Transportadora</SelectItem>
                <SelectItem value="Distribuidor">Distribuidor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right text-primary-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={newPartner.email}
              onChange={handleInputChange}
              className={cn("col-span-3 bg-slate-700 border-slate-600 text-primary-foreground", { "border-red-500": errors.email })}
              placeholder="email@exemplo.com"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="primary" onClick={handleAddPartner}>
            Adicionar Parceiro
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Partners;