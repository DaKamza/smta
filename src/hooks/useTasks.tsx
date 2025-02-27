
import { useState, useEffect } from 'react';
import { Task, TaskFormData } from '../types/task';
import { stringToDate } from '../utils/dateUtils';
import { toast } from '@/components/ui/sonner';

// In a real application, this would be connected to a backend API
// For now, we'll use localStorage for persistence
const LOCAL_STORAGE_KEY = 'student-tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    const loadTasks = () => {
      try {
        const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
            ...task,
            dueDate: new Date(task.dueDate),
            createdAt: new Date(task.createdAt)
          }));
          setTasks(parsedTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast.error('Failed to load your tasks');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoading]);

  // Add a new task
  const addTask = (formData: TaskFormData) => {
    try {
      const newTask: Task = {
        id: crypto.randomUUID(),
        ...formData,
        dueDate: stringToDate(formData.dueDate, formData.dueTime),
        completed: false,
        createdAt: new Date()
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      toast.success('Task created successfully');
      return true;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to create task');
      return false;
    }
  };

  // Update an existing task
  const updateTask = (id: string, formData: TaskFormData) => {
    try {
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
      toast.success('Task updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      return false;
    }
  };

  // Toggle task completion status
  const toggleTaskCompletion = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
    
    const task = tasks.find(t => t.id === id);
    if (task) {
      toast.success(task.completed ? 'Task marked as incomplete' : 'Task marked as complete');
    }
  };

  // Delete a task
  const deleteTask = (id: string) => {
    try {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
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
