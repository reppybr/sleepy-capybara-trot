"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { RefreshCw, PackagePlus, ChevronLeft, ChevronRight, Check, Factory, Users, ClipboardList, Hash, Search } from 'lucide-react'; // Added Search icon
import { generateBatchId } from '@/utils/batchIdGenerator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { usePartners, Partner } from '@/hooks/use-partners';
import PartnerCard from './PartnerCard';
import SummaryManifestCard from './SummaryManifestCard';

interface CreateBatchWizardProps {
  onClose: () => void;
  onSave: (batchData: {
    id: string;
    producerName: string;
    variety: string;
    internalNote?: string;
    initialHolderPublicKey: string;
    participantsPublicKeys: string[];
  }) => void;
}

const CreateBatchWizard: React.FC<CreateBatchWizardProps> = ({ onClose, onSave }) => {
  const { user: brandOwner } = useAuth();
  const { partners: allPartners, isLoading: partnersLoading } = usePartners();

  const [currentStep, setCurrentStep] = useState(1);
  const [producerName, setProducerName] = useState('');
  const [variety, setVariety] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [batchIdPrefix, setBatchIdPrefix] = useState('');
  const [batchIdYear, setBatchIdYear] = useState('');
  const [batchIdSuffix, setBatchIdSuffix] = useState('');
  const [fullBatchId, setFullBatchId] = useState('');
  const [initialHolder, setInitialHolder] = useState<Partner | null>(null);
  const [selectedParticipants, setSelectedParticipants] = useState<Partner[]>([]);
  const [participantSearchTerm, setParticipantSearchTerm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // --- Smart ID Logic ---
  const generateNewSuffix = useCallback(() => {
    const { suffix } = generateBatchId(producerName);
    setBatchIdSuffix(suffix);
  }, [producerName]);

  useEffect(() => {
    const { prefix, year, suffix } = generateBatchId(producerName, batchIdSuffix || undefined);
    setBatchIdPrefix(prefix);
    setBatchIdYear(year);
    if (!batchIdSuffix) {
      setBatchIdSuffix(suffix);
    }
  }, [producerName, batchIdSuffix]);

  useEffect(() => {
    if (batchIdPrefix && batchIdYear && batchIdSuffix) {
      setFullBatchId(`${batchIdPrefix}-${batchIdYear}-${batchIdSuffix}`);
    }
  }, [batchIdPrefix, batchIdYear, batchIdSuffix]);

  // --- Step 1 Validation ---
  const validateStep1 = () => {
    if (!producerName.trim() || producerName.trim().length < 3) {
      toast.error("O nome do produtor deve ter pelo menos 3 caracteres.");
      return false;
    }
    if (!variety.trim()) {
      toast.error("A variedade do café é obrigatória.");
      return false;
    }
    return true;
  };

  // --- Step 2 Validation ---
  const validateStep2 = () => {
    if (!initialHolder) {
      toast.error("Por favor, selecione quem está com a posse inicial do lote.");
      return false;
    }
    if (selectedParticipants.length === 0) {
      toast.error("Pelo menos um participante deve ser selecionado para a cadeia de custódia.");
      return false;
    }
    return true;
  };

  // --- Navigation ---
  const handleNextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // --- Step 2 Handlers ---
  const handleInitialHolderSelect = (partner: Partner) => {
    setInitialHolder(partner);
    // Ensure initial holder is always in selected participants
    setSelectedParticipants((prev) => {
      if (!prev.some(p => p.id === partner.id)) {
        return [...prev, partner];
      }
      return prev;
    });
  };

  const handleParticipantToggle = (partner: Partner) => {
    if (initialHolder?.id === partner.id) return; // Cannot deselect initial holder

    setSelectedParticipants((prev) => {
      if (prev.some((p) => p.id === partner.id)) {
        return prev.filter((p) => p.id !== partner.id);
      } else {
        return [...prev, partner];
      }
    });
  };

  // Filter partners for initial holder selection (only producers or brand owner)
  const initialHolderPartners = allPartners.filter(p => p.role === 'Produtor');
  // Add brand owner to initial holder options if not already a partner
  const brandOwnerAsPartner: Partner = {
    id: brandOwner.id,
    name: brandOwner.name,
    role: 'Produtor', // Assuming brand owner can also be an initial holder for their own batches
    email: brandOwner.email,
    public_key: brandOwner.public_key,
  };
  if (!initialHolderPartners.some(p => p.id === brandOwnerAsPartner.id)) {
    initialHolderPartners.unshift(brandOwnerAsPartner);
  }


  // Filter partners for general participants list
  const filteredParticipants = allPartners.filter(p =>
    p.name.toLowerCase().includes(participantSearchTerm.toLowerCase()) ||
    p.role.toLowerCase().includes(participantSearchTerm.toLowerCase())
  );

  // Ensure initialHolder is always in selectedParticipants when it's set
  useEffect(() => {
    if (initialHolder && !selectedParticipants.some(p => p.id === initialHolder.id)) {
      setSelectedParticipants(prev => [...prev, initialHolder]);
    }
  }, [initialHolder, selectedParticipants]);


  // --- Final Save ---
  const handleSaveBatch = async () => {
    if (!validateStep1() || !validateStep2()) {
      setCurrentStep(1); // Go back to step 1 if validation fails
      return;
    }

    if (!initialHolder) {
      toast.error("O detentor inicial é obrigatório.");
      return;
    }

    setIsSaving(true);
    toast.loading("Criando ativo digital do lote...", { id: "create-batch" });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      onSave({
        id: fullBatchId,
        producerName,
        variety,
        internalNote: internalNote || undefined,
        initialHolderPublicKey: initialHolder.public_key,
        participantsPublicKeys: selectedParticipants.map(p => p.public_key),
      });

      toast.success(`Lote ${fullBatchId} criado com sucesso!`, { id: "create-batch" });
      onClose();
    } catch (error) {
      toast.error("Falha ao criar o lote. Tente novamente.", { id: "create-batch" });
      console.error("Error creating batch:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const steps = [
    { title: "Identificação da Origem", icon: Factory },
    { title: "Cadeia de Custódia", icon: Users },
    { title: "Revisão do Lote", icon: ClipboardList },
  ];

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="flex items-center justify-between w-full max-w-md mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.title}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                  currentStep > index + 1
                    ? "bg-primary text-primary-foreground"
                    : currentStep === index + 1
                    ? "bg-primary/20 text-primary border border-primary"
                    : "bg-muted text-muted-foreground border border-border"
                )}
              >
                {currentStep > index + 1 ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className={cn("text-xs mt-2", currentStep >= index + 1 ? "text-primary-foreground" : "text-muted-foreground")}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2",
                  currentStep > index + 1 ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Identificação da Origem */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-primary-foreground">Identificação da Origem</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="producerName" className="text-primary-foreground">Nome do Produtor / Fazenda</Label>
              <Input
                id="producerName"
                value={producerName}
                onChange={(e) => setProducerName(e.target.value)}
                placeholder="Ex: Fazenda Santa Clara"
                className="bg-slate-700 border-slate-600 text-primary-foreground"
                autoFocus
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="variety" className="text-primary-foreground">Variedade do Café</Label>
              <Input
                id="variety"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="Ex: Catuaí Amarelo"
                className="bg-slate-700 border-slate-600 text-primary-foreground"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="internalNote" className="text-primary-foreground">Nota Interna (Opcional)</Label>
              <Input
                id="internalNote"
                value={internalNote}
                onChange={(e) => setInternalNote(e.target.value)}
                placeholder="Ref: Talhão 4, Safra Especial..."
                className="bg-slate-700 border-slate-600 text-primary-foreground"
              />
            </div>

            <Card className="p-4 flex flex-col space-y-2 bg-slate-800/70 border-slate-600">
              <div className="flex items-center justify-between">
                <Label className="text-primary-foreground flex items-center gap-2">
                  <Hash className="h-4 w-4 text-primary" /> ID do Ativo Digital
                </Label>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={generateNewSuffix}
                  className="shrink-0"
                  title="Gerar novo sufixo"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-3 border border-slate-600 rounded-md bg-slate-700 font-mono text-lg text-center">
                <span className="text-amber-400">{batchIdPrefix}</span>
                <span className="text-slate-300">-</span>
                <span className="text-slate-300">{batchIdYear}</span>
                <span className="text-slate-300">-</span>
                <span className="text-white">{batchIdSuffix}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Este é o ID único do seu lote. O prefixo é gerado do nome do produtor, o ano é o atual e o sufixo é aleatório.
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Step 2: Cadeia de Custódia */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-primary-foreground">Cadeia de Custódia</h3>

          {/* Part A: Initial Holder */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-foreground flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" /> Quem está com a posse física AGORA?
            </h4>
            {partnersLoading ? (
              <p className="text-muted-foreground">Carregando parceiros...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {initialHolderPartners.map((partner) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    isSelected={initialHolder?.id === partner.id}
                    onClick={handleInitialHolderSelect}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Part B: Participants */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-foreground flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Quem mais participará do processo?
            </h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar parceiros por nome ou papel..."
                className="w-full pl-9 bg-slate-700 border-slate-600 text-primary-foreground"
                value={participantSearchTerm}
                onChange={(e) => setParticipantSearchTerm(e.target.value)}
              />
            </div>
            {partnersLoading ? (
              <p className="text-muted-foreground">Carregando parceiros...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto pr-2">
                {filteredParticipants.map((partner) => (
                  <PartnerCard
                    key={partner.id}
                    partner={partner}
                    isSelected={selectedParticipants.some(p => p.id === partner.id)}
                    onClick={handleParticipantToggle}
                    isDisabled={initialHolder?.id === partner.id} // Disable if it's the initial holder
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Revisão do Lote */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-primary-foreground">Revisão do Lote</h3>
          <SummaryManifestCard
            batchId={fullBatchId}
            producerName={producerName}
            variety={variety}
            internalNote={internalNote}
            initialHolder={initialHolder}
            participants={selectedParticipants}
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <Button variant="secondary" onClick={handlePrevStep} disabled={isSaving}>
            <ChevronLeft className="h-4 w-4 mr-2" /> Voltar
          </Button>
        )}
        {currentStep < steps.length ? (
          <Button variant="primary" onClick={handleNextStep} className={cn({ "ml-auto": currentStep === 1 })} disabled={isSaving}>
            Próximo <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSaveBatch} disabled={isSaving}>
            {isSaving ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Criando...</span>
              </span>
            ) : (
              <>
                <PackagePlus className="h-4 w-4 mr-2" />
                <span>Criar Ativo Digital</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateBatchWizard;