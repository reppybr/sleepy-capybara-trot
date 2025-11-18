"use client";

import React, { useState } from 'react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, UserPlus, Search } from 'lucide-react';
import { usePartners, Partner } from '@/hooks/use-partners';
import PartnerCard from '@/components/wizards/PartnerCard';
import { addParticipantsToBatch } from '@/api/batchService'; // Import API function

interface AddParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  batchId: string;
  currentParticipantIds: string[];
}

const AddParticipantsModal: React.FC<AddParticipantsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  batchId,
  currentParticipantIds,
}) => {
  const { partners: allPartners, isLoading: partnersLoading } = usePartners();
  const [selectedNewParticipants, setSelectedNewParticipants] = useState<Partner[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const availablePartners = allPartners.filter(
    (p) => !currentParticipantIds.includes(p.id) &&
           (p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleToggleParticipant = (partner: Partner) => {
    setSelectedNewParticipants((prev) =>
      prev.some((p) => p.id === partner.id)
        ? prev.filter((p) => p.id !== partner.id)
        : [...prev, partner]
    );
  };

  const handleAddParticipants = async () => {
    if (selectedNewParticipants.length === 0) {
      toast.error("Por favor, selecione pelo menos um participante para adicionar.");
      return;
    }

    setIsAdding(true);
    toast.loading("Adicionando participantes...", { id: "add-participants" });

    try {
      const newParticipantPublicKeys = selectedNewParticipants.map(p => p.public_key);
      await addParticipantsToBatch(batchId, newParticipantPublicKeys);
      toast.success("Participantes adicionados com sucesso!", { id: "add-participants" });
      onSuccess();
      onClose();
      setSelectedNewParticipants([]); // Clear selection
      setSearchTerm('');
    } catch (error: any) {
      toast.error(error.message || "Falha ao adicionar participantes. Tente novamente.", { id: "add-participants" });
      console.error("Error adding participants:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title="Gerenciar Participantes do Lote"
      description="Adicione ou remova parceiros que farão parte da cadeia de custódia deste lote."
      className="sm:max-w-2xl"
    >
      <div className="space-y-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar parceiros por nome ou papel..."
            className="w-full pl-9 bg-slate-700 border-slate-600 text-primary-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <h3 className="text-lg font-semibold text-primary-foreground flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary" /> Adicionar Novos Participantes
        </h3>
        {partnersLoading ? (
          <p className="text-muted-foreground">Carregando parceiros...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto pr-2">
            {availablePartners.length > 0 ? (
              availablePartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  isSelected={selectedNewParticipants.some((p) => p.id === partner.id)}
                  onClick={handleToggleParticipant}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">Nenhum parceiro disponível para adicionar.</p>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-end pt-4">
        <Button
          variant="primary"
          onClick={handleAddParticipants}
          disabled={isAdding || selectedNewParticipants.length === 0}
        >
          {isAdding ? (
            <span className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary-foreground" />
              <span>Adicionando...</span>
            </span>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-2" />
              <span>Adicionar Selecionados ({selectedNewParticipants.length})</span>
            </>
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default AddParticipantsModal;