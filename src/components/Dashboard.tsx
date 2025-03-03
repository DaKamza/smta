
import { useState } from 'react';
import { Task, TaskFormData } from '@/types/task';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Grid3X3, Filter, CheckCircle, CheckCircle2, Edit, Trash } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { getTaskStatus } from '@/utils/dateUtils';
import { cn } from '@/lib/utils';

interface DashboardProps {
  tasks: Task[];
  isLoading: boolean;
  onAddTask: (data: TaskFormData) => Promise<boolean> | boolean;
  onUpdateTask: (id: string, data: TaskFormData) => Promise<boolean> | boolean;
  onDeleteTask: (id: string) => void;
  onToggleTaskCompletion: (id: string) => void;
}

type ViewMode = 'grid' | 'calendar';
type SortOption = 'dueDate' | 'createdAt' | 'courseName' | 'taskType';
type FilterOption = 'all' | 'active' | 'completed' | 'overdue';

const Dashboard = ({
  tasks,
  isLoading,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleTaskCompletion
}: DashboardProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const handleSubmitTask = async (data: TaskFormData) => {
    let success: boolean;
    
    if (editingTask) {
      success = await onUpdateTask(editingTask.id, data);
    } else {
      success = await onAddTask(data);
    }
    
    if (success) {
      handleCloseForm();
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (filterBy === 'all') return true;
    if (filterBy === 'completed') return task.completed;
    if (filterBy === 'active') return !task.completed;
    if (filterBy === 'overdue') {
      return getTaskStatus(task) === 'red' && !task.completed;
    }
    return true;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return a.dueDate.getTime() - b.dueDate.getTime();
      case 'createdAt':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'courseName':
        return a.courseName.localeCompare(b.courseName);
      case 'taskType':
        return a.taskType.localeCompare(b.taskType);
      default:
        return 0;
    }
  });

  // Group tasks by date for calendar view
  const groupedByDate = sortedTasks.reduce((groups, task) => {
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

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-bold tracking-tight">Task Manager</h1>
          <p className="text-muted-foreground">
            {isLoading ? 'Loading your tasks...' : 
              filteredTasks.length === 0 ? 'No tasks yet. Add your first task!' : 
              `Showing ${filteredTasks.length} task${filteredTasks.length === 1 ? '' : 's'}`
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

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-pulse">Loading tasks...</div>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <>
              {sortedTasks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTask}
                      onDelete={onDeleteTask}
                      onToggleComplete={onToggleTaskCompletion}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 p-6 rounded-full bg-muted">
                    <Calendar size={40} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No tasks found</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    {filterBy !== 'all'
                      ? `No ${filterBy} tasks found. Try changing your filter.`
                      : "You don't have any tasks yet. Get started by adding your first task."}
                  </p>
                  <Button onClick={handleAddTask}>
                    <Plus size={16} className="mr-2" /> Create Task
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              {calendarDates.length > 0 ? (
                calendarDates.map(dateStr => (
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
                                onClick={() => onToggleTaskCompletion(task.id)}
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
                                onClick={() => handleEditTask(task)}
                                className="h-8 w-8 p-0 rounded-full"
                              >
                                <span className="sr-only">Edit</span>
                                <Edit size={16} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => onDeleteTask(task.id)}
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
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-4 p-6 rounded-full bg-muted">
                    <Calendar size={40} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No tasks on calendar</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm">
                    {filterBy !== 'all'
                      ? `No ${filterBy} tasks found. Try changing your filter.`
                      : "You don't have any tasks with due dates yet."}
                  </p>
                  <Button onClick={handleAddTask}>
                    <Plus size={16} className="mr-2" /> Create Task
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <TaskForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitTask}
        initialData={editingTask}
        title={editingTask ? 'Edit Task' : 'Create Task'}
      />
    </div>
  );
};

export default Dashboard;
