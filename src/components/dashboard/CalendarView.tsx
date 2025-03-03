
import { Task } from '@/types/task';
import { getTaskStatus } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle, CheckCircle2, Edit, Trash } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const CalendarView = ({ 
  tasks, 
  onEdit, 
  onDelete, 
  onToggleComplete 
}: CalendarViewProps) => {
  // Group tasks by date
  const groupedByDate = tasks.reduce((groups, task) => {
    const dateKey = task.dueDate.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(task);
    return groups;
  }, {} as Record<string, Task[]>);

  const calendarDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  if (calendarDates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {calendarDates.map(dateStr => (
        <div key={dateStr} className="animate-fade-in">
          <h3 className="text-lg font-medium mb-3 sticky top-0 bg-background py-2 z-10">
            {new Date(dateStr).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </h3>
          <div className="space-y-3">
            {groupedByDate[dateStr].map(task => (
              <div key={task.id} className="bg-white dark:bg-black border rounded-lg p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-md text-xs",
                        "bg-secondary text-secondary-foreground"
                      )}>
                        {task.taskType}
                      </span>
                      <span className={cn(
                        "inline-flex h-2 w-2 rounded-full",
                        task.completed ? "bg-status-green" : 
                        getTaskStatus(task) === 'yellow' ? "bg-status-yellow" : 
                        getTaskStatus(task) === 'red' ? "bg-status-red" : 
                        "bg-status-green"
                      )} />
                    </div>
                    
                    <h4 className={cn(
                      "text-base font-medium mb-1",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.taskTopic}
                    </h4>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>{task.moduleName} ({task.moduleCode})</p>
                      <p>Due at {task.dueDate.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onToggleComplete(task.id)}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <span className="sr-only">
                        {task.completed ? "Mark as incomplete" : "Mark as complete"}
                      </span>
                      {task.completed ? 
                        <CheckCircle2 size={16} className="text-status-green" /> : 
                        <CheckCircle size={16} />
                      }
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEdit(task)}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <span className="sr-only">Edit</span>
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onDelete(task.id)}
                      className="h-8 w-8 p-0 rounded-full"
                    >
                      <span className="sr-only">Delete</span>
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarView;
