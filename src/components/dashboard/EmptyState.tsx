
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import { FilterOption } from './DashboardHeader';

interface EmptyStateProps {
  viewMode: 'grid' | 'calendar';
  filterBy: FilterOption;
  onAddTask: () => void;
}

const EmptyState = ({ viewMode, filterBy, onAddTask }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 p-6 rounded-full bg-muted">
        <Calendar size={40} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-medium mb-2">
        {viewMode === 'calendar' ? 'No tasks on calendar' : 'No tasks found'}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-sm">
        {filterBy !== 'all'
          ? `No ${filterBy} tasks found. Try changing your filter.`
          : viewMode === 'calendar'
            ? "You don't have any tasks with due dates yet."
            : "You don't have any tasks yet. Get started by adding your first task."}
      </p>
      <Button onClick={onAddTask}>
        <Plus size={16} className="mr-2" /> Create Task
      </Button>
    </div>
  );
};

export default EmptyState;
