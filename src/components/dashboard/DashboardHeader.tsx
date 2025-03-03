
import { Button } from '@/components/ui/button';
import { Plus, Grid3X3, Calendar } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

export type ViewMode = 'grid' | 'calendar';
export type SortOption = 'dueDate' | 'createdAt' | 'courseName' | 'taskType';
export type FilterOption = 'all' | 'active' | 'completed' | 'overdue';

interface DashboardHeaderProps {
  tasksCount: number;
  isLoading: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  filterBy: FilterOption;
  setFilterBy: (option: FilterOption) => void;
  handleAddTask: () => void;
}

const DashboardHeader = ({
  tasksCount,
  isLoading,
  viewMode,
  setViewMode,
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy,
  handleAddTask
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="font-bold tracking-tight">Task Manager</h1>
        <p className="text-muted-foreground">
          {isLoading ? 'Loading your tasks...' : 
            tasksCount === 0 ? 'No tasks yet. Add your first task!' : 
            `Showing ${tasksCount} task${tasksCount === 1 ? '' : 's'}`
          }
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="flex items-center gap-2"
          >
            <Grid3X3 size={16} />
            <span className="hidden sm:inline">Grid</span>
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="flex items-center gap-2"
          >
            <Calendar size={16} />
            <span className="hidden sm:inline">Calendar</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
            <SelectTrigger className="w-[100px] sm:w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate">Due Date</SelectItem>
              <SelectItem value="createdAt">Created</SelectItem>
              <SelectItem value="courseName">Course</SelectItem>
              <SelectItem value="taskType">Task Type</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={(value) => setFilterBy(value as FilterOption)}>
            <SelectTrigger className="w-[100px] sm:w-[130px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleAddTask} className="ml-1 shrink-0">
            <Plus size={16} className="mr-1" /> 
            <span className="hidden sm:inline">Add Task</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
