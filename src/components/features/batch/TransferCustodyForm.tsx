"use client";

import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { toast } from 'sonner';
import { Loader2, Send, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePartners, Partner } from '@/hooks/use-partners';
import { transferCustody } from '@/api/batchService'; // Import the API function
import PartnerCard from '@/components/wizards/PartnerCard'; // Reusing PartnerCard
import { Input } from '@/components/ui/input'; // Import Input for search

interface TransferCustodyFormProps {
  batch: any; // Full batch data
  currentHolderKey: string;
  onTransferSuccess: () => void;
}

export const TransferCustodyForm: React.FC<TransferCustodyFormProps> = ({ batch, currentHolderKey, onTransferSuccess }) => {
  const { user } = useAuth();
  const { partners: allPartners, isLoading: partnersLoading } = usePartners();
  const [selectedNextHolder, setSelectedNextHolder] = useState<Partner | null>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter partners to exclude the current holder and only include those in batch_participants
  const eligibleNextHolders = allPartners.filter(p =>
    p.public_key !== currentHolderKey &&
    batch.details.batch_participants.some((bp: any) => bp.partner.public_key === p.public_key)
  );

  const filteredPartners = eligibleNextHolders.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectNextHolder = (partner: Partner) => {
    setSelectedNextHolder(partner);
  };

  const handleTransferCustody = async () => {
    if (!selectedNextHolder) {
      toast.error("Por favor, selecione o próximo detentor da custódia.");
      return;
    }

    if (!user) {
      toast.error("Usuário não autenticado.");
      return;
    }

    setIsTransferring(true);
    toast.loading("Transferindo custódia...", { id: "transfer-custody" });

    try {
      await transferCustody(batch.details.id, currentHolderKey, selectedNextHolder.public_key);
      toast.success("Custódia transferida com sucesso!", { id: "transfer-custody" });
      onTransferSuccess();
    } catch (error: any) {
      toast.error(error.message || "Falha ao transferir a custódia. Tente novamente.", { id: "transfer-custody" });
      console.error("Error transferring custody:", error);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <Card className="p-6 space-y-6 bg-slate-800/60 backdrop-blur-md border border-amber-500/50">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar próximo detentor por nome ou papel..."
          className="w-full pl-9 bg-slate-700 border-slate-600 text-primary-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {partnersLoading ? (
        <p className="text-muted-foreground">Carregando parceiros...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto pr-2">
          {filteredPartners.length > 0 ? (
            filteredPartners.map((partner) => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                isSelected={selectedNextHolder?.id === partner.id}
                onClick={handleSelectNextHolder}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground">Nenhum parceiro elegível encontrado.</p>
          )}
        </div>
      )}
      <div className="flex justify-end pt-4">
        <Button variant="primary" onClick={handleTransferCustody} disabled={isTransferring || !selectedNextHolder}>
          {isTransferring ? (
            <span className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary-foreground" />
              <span>Transferindo...</span>
            </span>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              <span>Transferir Custódia</span>
            </>
          )}
        </Button>
      </div>
    </Card>
  );
};