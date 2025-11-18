import React from 'react';
import CommonCard from "@/components/common/Card"; // Using the common Card component
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Using shadcn Card sub-components for structure
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  trend: string;
  trendPositive?: boolean;
  trendUrgency?: boolean;
  icon: LucideIcon;
  color: string; // Tailwind border color class, e.g., "border-blue-500"
  textColor: string; // Tailwind text color class, e.g., "text-blue-400"
}

const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  trend,
  trendPositive,
  trendUrgency,
  icon: Icon,
  color,
  textColor,
}) => {
  const TrendIcon = trendUrgency ? AlertTriangle : (trendPositive ? TrendingUp : TrendingDown);
  const trendColor = trendUrgency ? "text-red-400" : (trendPositive ? "text-emerald-400" : "text-red-400");

  return (
    <CommonCard className={cn(
      "relative overflow-hidden bg-slate-800/60 backdrop-blur-md border-l-4", // Apply glassmorphism here
      color,
      "transition-all duration-300 ease-in-out hover:shadow-xl hover:border-opacity-75 p-0" // Remove default padding from CommonCard
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6"> {/* Add padding back to header/content */}
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className={cn("h-4 w-4", textColor)} />
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="text-2xl font-bold text-primary-foreground">{value}</div>
        <p className={cn("flex items-center text-xs mt-1", trendColor)}>
          <TrendIcon className="h-3 w-3 mr-1" />
          <span>{trend}</span>
        </p>
      </CardContent>
    </CommonCard>
  );
};

export default KpiCard;