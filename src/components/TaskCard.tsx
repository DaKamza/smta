
import { useState } from 'react';
import { Task } from '@/types/task';
import { formatDateTime, getDaysRemaining, getTaskStatus, getStatusText } from '@/utils/dateUtils';
import StatusBadge from './StatusBadge';
import { CheckCircle, Clock, Edit, Trash, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const status = getTaskStatus(task);
  const daysRemaining = getDaysRemaining(task.dueDate);
  const statusText = getStatusText(status, daysRemaining);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div 
      className={cn(
        'relative group bg-white dark:bg-black border rounded-xl p-5 transition-all duration-300 animate-hover',
        'shadow-sm hover:shadow-md',
        task.completed && 'bg-accent/50',
        'animate-scale-in'
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute right-4 top-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onToggleComplete(task.id)}
          className="text-muted-foreground hover:text-primary transition-colors"
          title={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? 
            <CheckCircle2 size={18} className="text-status-green" /> : 
            <CheckCircle size={18} />
          }
        </button>
        <button 
          onClick={() => onEdit(task)}
          className="text-muted-foreground hover:text-primary transition-colors"
          title="Edit task"
        >
          <Edit size={18} />
        </button>
        <button 
          onClick={handleDelete}
          className="text-muted-foreground hover:text-destructive transition-colors"
          title="Delete task"
        >
          <Trash size={18} />
        </button>
      </div>

      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className={cn(
            'text-lg font-medium mb-1 transition-colors',
            task.completed && 'text-muted-foreground line-through'
          )}>
            {task.taskTopic}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {task.moduleName} ({task.moduleCode})
          </p>
          <p className="text-xs text-muted-foreground">
            {task.courseName}
          </p>
        </div>
      </div>

      <div className="mb-3 flex items-center text-sm gap-2">
        <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary text-secondary-foreground text-xs">
          {task.taskType}
        </span>
        <StatusBadge status={status}>
          {statusText}
        </StatusBadge>
      </div>

      <div className="flex items-center text-sm text-muted-foreground">
        <Clock size={14} className="mr-1.5" />
        <span>Due: {formatDateTime(task.dueDate)}</span>
      </div>
    </div>
  );
};

export default TaskCard;
