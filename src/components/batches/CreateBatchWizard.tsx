"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Button from '@/components/common/Button'; // Corrected import: changed from named import to default import
import { RefreshCw, PackagePlus } from 'lucide-react';
import { generateBatchId } from '@/utils/batchIdGenerator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CreateBatchWizardProps {
  onClose: () => void;
  onSave: (batchData: { id: string; producerName: string; variety: string; }) => void;
}

const CreateBatchWizard: React.FC<CreateBatchWizardProps> = ({ onClose, onSave }) => {
  const [producerName, setProducerName] = useState('');
  const [variety, setVariety] = useState('');
  const [batchIdPrefix, setBatchIdPrefix] = useState('');
  const [batchIdYear, setBatchIdYear] = useState('');
  const [batchIdSuffix, setBatchIdSuffix] = useState('');
  const [fullBatchId, setFullBatchId] = useState('');

  const generateNewSuffix = useCallback(() => {
    // Regenera apenas o sufixo, mantendo o prefixo e ano baseados no nome do produtor
    const { suffix } = generateBatchId(producerName);
    setBatchIdSuffix(suffix);
  }, [producerName]);

  useEffect(() => {
    // Gera o ID completo (prefixo, ano, sufixo)
    const { prefix, year, suffix } = generateBatchId(producerName, batchIdSuffix || undefined);
    setBatchIdPrefix(prefix);
    setBatchIdYear(year);
    if (!batchIdSuffix) { // Define o sufixo inicial apenas se ainda não tiver sido definido
      setBatchIdSuffix(suffix);
    }
  }, [producerName, batchIdSuffix]);

  useEffect(() => {
    // Atualiza o ID completo formatado
    if (batchIdPrefix && batchIdYear && batchIdSuffix) {
      setFullBatchId(`${batchIdPrefix}-${batchIdYear}-${batchIdSuffix}`);
    }
  }, [batchIdPrefix, batchIdYear, batchIdSuffix]);

  const handleSave = () => {
    if (!producerName.trim()) {
      toast.error("O nome do produtor é obrigatório.");
      return;
    }
    if (!variety.trim()) {
      toast.error("A variedade do café é obrigatória.");
      return;
    }
    if (!fullBatchId) {
      toast.error("O ID do lote não foi gerado.");
      return;
    }
    onSave({ id: fullBatchId, producerName, variety });
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="producerName" className="text-primary-foreground">Nome do Produtor</Label>
        <Input
          id="producerName"
          value={producerName}
          onChange={(e) => setProducerName(e.target.value)}
          placeholder="Ex: Fazenda Santa Clara"
          className="bg-slate-700 border-slate-600 text-primary-foreground"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-primary-foreground">ID do Lote</Label>
        <div className="flex items-center space-x-2">
          <div className="flex-1 p-3 border border-slate-600 rounded-md bg-slate-700 font-mono text-lg">
            <span className="text-amber-400">{batchIdPrefix}</span>
            <span className="text-slate-300">-</span>
            <span className="text-slate-300">{batchIdYear}</span>
            <span className="text-slate-300">-</span>
            <span className="text-white">{batchIdSuffix}</span>
          </div>
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
        <p className="text-sm text-muted-foreground">
          Este é o ID único do seu lote. O prefixo é gerado do nome do produtor, o ano é o atual e o sufixo é aleatório.
        </p>
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

      <div className="flex justify-end space-x-2 mt-6">
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} className="flex items-center space-x-2">
          <PackagePlus className="h-4 w-4" />
          <span>Criar Lote</span>
        </Button>
      </div>
    </div>
  );
};

export default CreateBatchWizard;