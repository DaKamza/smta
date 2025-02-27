
import { TaskStatus } from '@/types/task';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: TaskStatus;
  children: React.ReactNode;
  className?: string;
}

const StatusBadge = ({ status, children, className }: StatusBadgeProps) => {
  return (
    <div 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
        status === 'green' && 'bg-status-green/20 text-status-green border border-status-green/30',
        status === 'yellow' && 'bg-status-yellow/20 text-status-yellow border border-status-yellow/30',
        status === 'red' && 'bg-status-red/20 text-status-red border border-status-red/30',
        className
      )}
    >
      <span 
        className={cn(
          'w-2 h-2 rounded-full mr-1.5',
          status === 'green' && 'bg-status-green',
          status === 'yellow' && 'bg-status-yellow',
          status === 'red' && 'bg-status-red'
        )} 
      />
      {children}
    </div>
  );
};

export default StatusBadge;
