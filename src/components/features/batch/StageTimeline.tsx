"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Truck,
  ClipboardCheck,
  Factory, // Using Factory for roaster
  MapPin,
  CheckCircle,
  CircleDashed,
  Clock,
  User,
  Link as LinkIcon,
  PackagePlus,
  Circle,
  Leaf, // For producer
  Warehouse, // For warehouse
  Box, // For packager
  ShoppingBag, // For distributor
  Sparkles, // For end_consumer
  HeartHandshake, // For sustainability
  Cog, // For beneficiamento
} from 'lucide-react';

export interface TimelineEvent {
  id: string;
  type: 'creation' | 'verification' | 'movement' | 'system' | 'custom' | string; // Allow custom string types for roles
  title: string;
  actor: string;
  timestamp: string;
  hash?: string;
  status: 'completed' | 'active' | 'predicted';
  formData?: any; // Optional form data for detailed view
}

interface StageTimelineProps {
  stages: TimelineEvent[];
}

const getIconForEventType = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'creation':
      return PackagePlus;
    case 'producer':
      return Leaf;
    case 'logistics':
      return Truck;
    case 'warehouse':
      return Warehouse;
    case 'grader':
      return ClipboardCheck;
    case 'roaster': // Changed to Factory
      return Factory;
    case 'packager':
      return Box;
    case 'distributor':
      return ShoppingBag;
    case 'end_consumer':
      return Sparkles;
    case 'sustainability':
      return HeartHandshake;
    case 'beneficiamento':
      return Cog;
    case 'system':
      return Factory; // System events like finalization
    case 'movement': // For custody transfers
      return Truck;
    case 'custom':
    default:
      return Circle;
  }
};

const StageTimeline: React.FC<StageTimelineProps> = ({ stages }) => {
  return (
    <div className="relative pl-8">
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-700"></div>

      {stages.map((event, index) => {
        const Icon = getIconForEventType(event.type);
        const isCompleted = event.status === 'completed';
        const isActive = event.status === 'active';
        const isPredicted = event.status === 'predicted';

        return (
          <div key={event.id} className="mb-8 flex items-start">
            {/* Icon and Line Connector */}
            <div className="absolute left-0 flex h-8 w-8 items-center justify-center">
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center",
                  isCompleted && "bg-emerald-600 text-white",
                  isActive && "bg-primary text-primary-foreground ring-2 ring-primary/50 animate-pulse",
                  isPredicted && "bg-slate-700 text-slate-400 border border-slate-600"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            {/* Event Content */}
            <div className="ml-8 flex-1">
              <h4
                className={cn(
                  "text-lg font-semibold",
                  isCompleted && "text-primary-foreground",
                  isActive && "text-primary",
                  isPredicted && "text-muted-foreground"
                )}
              >
                {event.title}
              </h4>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" /> {new Date(event.timestamp).toLocaleString('pt-BR')}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" /> {event.actor}
              </p>
              {event.formData && Object.keys(event.formData).length > 0 && (
                <div className="mt-2 p-3 bg-slate-700/50 rounded-md text-xs text-muted-foreground">
                  <p className="font-semibold text-primary-foreground mb-1">Detalhes da Etapa:</p>
                  {Object.entries(event.formData).map(([key, value]) => (
                    <p key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                      <span className="font-medium text-primary-foreground">{String(value)}</span>
                    </p>
                  ))}
                </div>
              )}
              {event.hash && (
                <a
                  href={`https://etherscan.io/tx/${event.hash}`} // Example link, replace with actual blockchain explorer
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1"
                >
                  <LinkIcon className="h-3 w-3" /> Transação: <span className="font-mono">{event.hash.substring(0, 6)}...{event.hash.substring(event.hash.length - 4)}</span>
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StageTimeline;