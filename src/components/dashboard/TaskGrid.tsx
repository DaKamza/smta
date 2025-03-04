
import { Task } from '@/types/task';
import TaskCard from '../TaskCard';

interface TaskGridProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskGrid = ({ 
  tasks, 
  onEdit, 
  onDelete, 
  onToggleComplete 
}: TaskGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.length > 0 ? (
        tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        ))
      ) : (
        <div className="col-span-full">
          {/* Empty grid state - the EmptyState component in Dashboard will handle this */}
        </div>
      )}
    </div>
  );
};

export default TaskGrid;
