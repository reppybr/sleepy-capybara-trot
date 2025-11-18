import React from 'react';
import { cn } from '@/lib/utils';
import {
  Truck,
  ClipboardCheck,
  Factory,
  MapPin,
  CheckCircle,
  CircleDashed,
  Clock,
  User,
  Link as LinkIcon,
  PackagePlus,
  Circle,
} from 'lucide-react';

export interface TimelineEvent {
  id: number;
  type: 'creation' | 'verification' | 'movement' | 'system' | 'custom';
  title: string;
  actor: string;
  timestamp: string;
  hash?: string;
  status: 'completed' | 'active' | 'predicted';
}

interface TimelineProps {
  events: TimelineEvent[];
}

const getIconForEventType = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'creation':
      return PackagePlus;
    case 'verification':
      return ClipboardCheck;
    case 'movement':
      return Truck;
    case 'system':
      return Factory;
    case 'custom':
    default:
      return Circle;
  }
};

const Timeline: React.FC<TimelineProps> = ({ events }) => {
  return (
    <div className="relative pl-8">
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-700"></div>

      {events.map((event, index) => {
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
                <Clock className="h-3 w-3" /> {event.timestamp}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" /> {event.actor}
              </p>
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

export default Timeline;