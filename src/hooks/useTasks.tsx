
import { useState, useEffect } from 'react';
import { Task, TaskFormData } from '../types/task';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { 
  fetchTasks, 
  createTask, 
  updateTaskById, 
  toggleTaskCompletionById, 
  deleteTaskById 
} from '../services/taskService';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const loadTasks = async () => {
      if (!user) {
        setTasks([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [user?.id]);

  const addTask = async (formData: TaskFormData): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to add tasks');
      return false;
    }
    
    const newTask = await createTask(formData, user.id);
    if (newTask) {
      setTasks(prevTasks => [...prevTasks, newTask]);
      return true;
    }
    
    return false;
  };

  const updateTask = async (id: string, formData: TaskFormData): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to update tasks');
      return false;
    }
    
    const success = await updateTaskById(id, formData);
    if (success) {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id 
            ? {
                ...task,
                ...formData,
                dueDate: stringToDate(formData.dueDate, formData.dueTime)
              } 
            : task
        )
      );
      return true;
    }
    
    return false;
  };

  const toggleTaskCompletion = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to update tasks');
      return;
    }
    
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const success = await toggleTaskCompletionById(id, task.completed);
    if (success) {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id 
            ? { ...task, completed: !task.completed } 
            : task
        )
      );
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete tasks');
      return;
    }
    
    const success = await deleteTaskById(id);
    if (success) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }
  };

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    toggleTaskCompletion,
    deleteTask
  };
};

// Import stringToDate for local date transformation in updateTask
import { stringToDate } from '../utils/dateUtils';
