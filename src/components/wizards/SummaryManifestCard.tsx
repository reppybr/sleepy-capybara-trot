import React from 'react';
import Card from '@/components/common/Card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Badge from '@/components/common/Badge'; // Added missing import for Badge
import { Package, User, Factory, ClipboardList, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Partner } from '@/hooks/use-partners';
import { roles } from '@/constants/roles'; // Import roles from new file

interface SummaryManifestCardProps {
  batchId: string;
  producerName: string;
  variety: string;
  internalNote?: string;
  initialHolder: Partner | null;
  participants: Partner[];
}

const SummaryManifestCard: React.FC<SummaryManifestCardProps> = ({
  batchId,
  producerName,
  variety,
  internalNote,
  initialHolder,
  participants,
}) => {
  // Helper to get role label from value
  const getRoleLabel = (roleValue: string) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  return (
    <Card className="p-6 space-y-6 bg-slate-800/60 backdrop-blur-md border border-slate-700">
      <h3 className="text-2xl font-bold text-primary-foreground flex items-center space-x-3">
        <Package className="h-6 w-6 text-primary" />
        <span>Manifesto do Lote</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2"><Hash className="h-4 w-4 text-slate-500" /> ID do Lote:</p>
          <p className="font-mono text-xl text-primary-foreground break-all">{batchId}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2"><Factory className="h-4 w-4 text-slate-500" /> Produtor:</p>
          <p className="text-lg text-primary-foreground">{producerName}</p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium flex items-center gap-2"><ClipboardList className="h-4 w-4 text-slate-500" /> Variedade:</p>
          <p className="text-lg text-primary-foreground">{variety}</p>
        </div>
        {internalNote && (
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2"><ClipboardList className="h-4 w-4 text-slate-500" /> Nota Interna:</p>
            <p className="text-lg text-primary-foreground italic">{internalNote}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h4 className="text-xl font-semibold text-primary-foreground flex items-center space-x-2">
          <User className="h-5 w-5 text-primary" />
          <span>Cadeia de Custódia</span>
        </h4>
        {initialHolder && (
          <div className="flex items-center space-x-3 p-3 bg-slate-700/50 rounded-md border border-slate-600">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initialHolder.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-primary-foreground">{initialHolder.name}</p>
              <p className="text-sm text-muted-foreground">{getRoleLabel(initialHolder.role)} (Posse Inicial)</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Outros Participantes ({participants.length - (initialHolder ? 1 : 0)}):</p>
          <div className="flex flex-wrap gap-2">
            {participants.filter(p => p.id !== initialHolder?.id).map(p => (
              <Badge key={p.id} variant="secondary" className="flex items-center space-x-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="bg-slate-600 text-slate-300 text-xs">
                    {p.name.split(' ').map(n => n[0]).join('').substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{p.name}</span>
              </Badge>
            ))}
            {participants.length - (initialHolder ? 1 : 0) === 0 && (
              <p className="text-sm text-muted-foreground italic">Nenhum outro participante selecionado.</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SummaryManifestCard;