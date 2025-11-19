"use client";

import React, { useState } from 'react';
import Card from '@/components/common/Card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Users, Trash2, X } from 'lucide-react';
import { Partner } from '@/hooks/use-partners';
import { roles } from '@/constants/roles'; // Import roles from new file
import { cn } from '@/lib/utils';
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

interface ParticipantsCardProps {
  batchId: string;
  participants: { id: string; partner: Partner; joined_at: string }[];
  isOwner: boolean;
  onParticipantRemoved: () => void;
  batchData: any; // Full batch data to check current holder
}

const ParticipantsCard: React.FC<ParticipantsCardProps> = ({
  batchId,
  participants,
  isOwner,
  onParticipantRemoved,
  batchData,
}) => {
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);
  const [participantToRemove, setParticipantToRemove] = useState<Partner | null>(null);

  const getRoleLabel = (roleValue: string) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  const handleRemoveClick = (partner: Partner) => {
    if (partner.public_key === batchData.details.brand_owner_key) {
      toast.error("O dono da marca não pode ser removido da lista de participantes.");
      return;
    }
    if (partner.public_key === batchData.details.current_holder_key) {
      toast.error("O detentor atual do lote não pode ser removido.");
      return;
    }
    setParticipantToRemove(partner);
    setIsDeleteConfirmModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!participantToRemove) return;

    toast.loading(`Removendo ${participantToRemove.name}...`, { id: "remove-participant" });
    try {
      // Simulate API call to remove participant
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, you'd call an API to update the batch participants
      console.log(`Simulating removal of participant: ${participantToRemove.name}`);
      toast.success(`${participantToRemove.name} removido com sucesso!`, { id: "remove-participant" });
      onParticipantRemoved(); // Trigger refresh of batch data
      setIsDeleteConfirmModalOpen(false);
      setParticipantToRemove(null);
    } catch (error: any) {
      toast.error(error.message || "Falha ao remover participante. Tente novamente.", { id: "remove-participant" });
      console.error("Error removing participant:", error);
    }
  };

  return (
    <Card className="p-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
      <h2 className="text-xl font-semibold text-primary-foreground mb-6 flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" /> Participantes da Cadeia
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {participants.map((bp) => {
          const partner = bp.partner;
          if (!partner) return null; // Handle cases where partner might be undefined
          const isCurrentHolder = partner.public_key === batchData.details.current_holder_key;
          const isBrandOwner = partner.public_key === batchData.details.brand_owner_key;

          return (
            <div
              key={partner.id}
              className={cn(
                "relative p-4 border rounded-lg flex items-center space-x-3 transition-all duration-200",
                isCurrentHolder ? "border-blue-500 ring-1 ring-blue-500/50 bg-blue-900/20" : "border-slate-700 bg-slate-700/50",
                "hover:border-primary hover:shadow-md"
              )}
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                  {partner.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-primary-foreground">{partner.name}</p>
                <p className="text-sm text-muted-foreground">{getRoleLabel(partner.role)}</p>
              </div>
              {isCurrentHolder && (
                <span className="absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold bg-blue-600 text-white rounded-full">
                  Atual
                </span>
              )}
              {isBrandOwner && (
                <span className="absolute bottom-2 right-2 px-2 py-0.5 text-xs font-semibold bg-amber-600 text-white rounded-full">
                  Dono
                </span>
              )}
              {isOwner && !isCurrentHolder && !isBrandOwner && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 text-red-400 hover:bg-red-900/20"
                  onClick={() => handleRemoveClick(partner)}
                  title={`Remover ${partner.name}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <AlertDialog open={isDeleteConfirmModalOpen} onOpenChange={setIsDeleteConfirmModalOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-primary-foreground">Remover Participante?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Tem certeza que deseja remover{" "}
              <span className="font-semibold text-primary-foreground">{participantToRemove?.name}</span> da cadeia de custódia deste lote?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-slate-600 text-muted-foreground hover:bg-slate-700 hover:text-primary-foreground">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove} className="bg-red-600 text-white hover:bg-red-700">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ParticipantsCard;