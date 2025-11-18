"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Partner } from '@/hooks/use-partners';
import { roles } from '@/constants/stageFormSchemas';
import { Check, Loader2 } from 'lucide-react';

interface MiniTimelineStepperProps {
  batchParticipants: { id: string; partner: Partner; joined_at: string }[];
  currentHolderKey: string;
  userPublicKey: string;
  stages: any[]; // Array of completed stages
}

const MiniTimelineStepper: React.FC<MiniTimelineStepperProps> = ({
  batchParticipants,
  currentHolderKey,
  userPublicKey,
  stages,
}) => {
  // Filter out brand_owner from the main flow for the stepper, unless they are the current holder
  const orderedParticipants = batchParticipants
    .filter(p => p.partner.role !== 'brand_owner' || p.partner.public_key === currentHolderKey)
    .sort((a, b) => new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime());

  return (
    <div className="flex items-center justify-center w-full py-4">
      {orderedParticipants.map((participant, index) => {
        const isCompleted = stages.some(s => s.actor === participant.partner.name); // Simplified check
        const isCurrent = participant.partner.public_key === currentHolderKey;
        const isYou = participant.partner.public_key === userPublicKey;
        const roleLabel = roles.find(r => r.value === participant.partner.role)?.label || participant.partner.role;

        return (
          <React.Fragment key={participant.id}>
            <div className="flex flex-col items-center min-w-[80px] text-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                  isCompleted
                    ? "bg-emerald-600 text-white"
                    : isCurrent
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/50 animate-pulse"
                    : "bg-slate-700 text-muted-foreground border border-slate-600"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-xs mt-2 max-w-[80px] truncate",
                  isYou ? "font-bold text-primary" : isCompleted ? "text-primary-foreground" : "text-muted-foreground"
                )}
                title={roleLabel}
              >
                {isYou ? "Você" : roleLabel}
              </span>
            </div>
            {index < orderedParticipants.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-all duration-300",
                  isCompleted ? "bg-emerald-600" : "bg-slate-700"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default MiniTimelineStepper;