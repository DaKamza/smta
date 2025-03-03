
import { useState } from 'react';
import { Task, TaskFormData } from '@/types/task';
import TaskForm from './TaskForm';
import DashboardHeader, { 
  ViewMode, 
  SortOption,
  FilterOption 
} from './dashboard/DashboardHeader';
import TaskGrid from './dashboard/TaskGrid';
import CalendarView from './dashboard/CalendarView';
import EmptyState from './dashboard/EmptyState';
import { getTaskStatus } from '@/utils/dateUtils';

interface DashboardProps {
  tasks: Task[];
  isLoading: boolean;
  onAddTask: (data: TaskFormData) => Promise<boolean> | boolean;
  onUpdateTask: (id: string, data: TaskFormData) => Promise<boolean> | boolean;
  onDeleteTask: (id: string) => void;
  onToggleTaskCompletion: (id: string) => void;
}

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

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-pulse">Loading tasks...</div>
        </div>
      );
    }

    if (sortedTasks.length === 0) {
      return <EmptyState viewMode={viewMode} filterBy={filterBy} onAddTask={handleAddTask} />;
    }

    return viewMode === 'grid' ? (
      <TaskGrid 
        tasks={sortedTasks} 
        onEdit={handleEditTask}
        onDelete={onDeleteTask}
        onToggleComplete={onToggleTaskCompletion}
      />
    ) : (
      <CalendarView 
        tasks={sortedTasks}
        onEdit={handleEditTask}
        onDelete={onDeleteTask}
        onToggleComplete={onToggleTaskCompletion}
      />
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <DashboardHeader 
        tasksCount={filteredTasks.length}
        isLoading={isLoading}
        viewMode={viewMode}
        setViewMode={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        handleAddTask={handleAddTask}
      />
      
      {renderContent()}

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
