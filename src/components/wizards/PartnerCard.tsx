import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Badge from '@/components/common/Badge';
import Card from '@/components/common/Card';
import { cn } from '@/lib/utils';
import { Partner, PartnerRole } from '@/hooks/use-partners'; // Import Partner interface
import { roles } from '@/constants/stageFormSchemas'; // Import roles array

interface PartnerCardProps {
  partner: Partner;
  isSelected?: boolean;
  onClick?: (partner: Partner) => void;
  isDisabled?: boolean;
}

// Map role values to badge variants
const roleToBadgeVariant: Record<PartnerRole, 'criado' | 'emandamento' | 'concluido' | 'bloqueado' | 'default'> = {
  'producer': 'criado',
  'roaster': 'emandamento',
  'logistics': 'bloqueado', // Using 'bloqueado' for logistics for visual distinction
  'distributor': 'default',
  'warehouse': 'criado', // Example mapping
  'grader': 'emandamento', // Example mapping
  'packager': 'criado', // Example mapping
  'end_consumer': 'default', // Example mapping
  'sustainability': 'concluido', // Example mapping
  'beneficiamento': 'emandamento', // Example mapping
};

const PartnerCard: React.FC<PartnerCardProps> = ({ partner, isSelected, onClick, isDisabled }) => {
  const initials = partner.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const badgeVariant = roleToBadgeVariant[partner.role] || 'default';

  // Helper to get role label from value
  const getRoleLabel = (roleValue: PartnerRole) => {
    const role = roles.find(r => r.value === roleValue);
    return role ? role.label : roleValue;
  };

  return (
    <Card
      className={cn(
        "p-4 flex flex-col items-center text-center space-y-2 cursor-pointer transition-all duration-200",
        "hover:border-primary hover:shadow-md",
        isSelected && "border-primary ring-2 ring-primary/50",
        isDisabled && "opacity-50 cursor-not-allowed hover:border-slate-700 hover:shadow-lg"
      )}
      onClick={() => !isDisabled && onClick?.(partner)}
    >
      <Avatar className="h-12 w-12">
        <AvatarFallback className="bg-muted text-muted-foreground text-lg">
          {initials}
        </AvatarFallback>
      </Avatar>
      <h4 className="font-semibold text-primary-foreground text-base">{partner.name}</h4>
      <Badge variant={badgeVariant}>{getRoleLabel(partner.role)}</Badge> {/* Display label */}
      {isSelected && (
        <span className="absolute top-2 right-2 text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><path d="m9 11 3 3L22 4"></path></svg>
        </span>
      )}
    </Card>
  );
};

export default PartnerCard;