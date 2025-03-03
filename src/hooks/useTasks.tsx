
import { useState, useEffect } from 'react';
import { Task, TaskFormData } from '../types/task';
import { stringToDate } from '../utils/dateUtils';
import { toast } from 'sonner';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // Load tasks from Supabase on initial render or when user changes
  useEffect(() => {
    const loadTasks = async () => {
      if (!user) {
        setTasks([]);
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('due_date', { ascending: true });
        
        if (error) {
          console.error('Error loading tasks:', error);
          toast.error('Failed to load your tasks');
          setTasks([]);
        } else {
          // Transform Supabase data to match our Task type
          const formattedTasks: Task[] = data.map((task: any) => ({
            id: task.id,
            courseName: task.title.split(' - ')[0] || '',
            moduleName: task.title.split(' - ')[1] || '',
            moduleCode: task.description.split(' - ')[0] || '',
            taskType: task.priority as any || 'Assignment',
            taskTopic: task.description.split(' - ')[1] || task.description || '',
            dueDate: new Date(task.due_date),
            completed: task.completed,
            createdAt: new Date(task.created_at)
          }));
          
          setTasks(formattedTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast.error('Failed to load your tasks');
        setTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Load tasks when component mounts or user changes
    loadTasks();
  }, [user?.id]);

  // Add a new task
  const addTask = async (formData: TaskFormData) => {
    if (!user) {
      toast.error('You must be logged in to add tasks');
      return false;
    }
    
    try {
      // Format task for Supabase
      const dueDate = stringToDate(formData.dueDate, formData.dueTime);
      
      const taskData = {
        user_id: user.id,
        title: `${formData.courseName} - ${formData.moduleName}`,
        description: `${formData.moduleCode} - ${formData.taskTopic}`,
        due_date: dueDate.toISOString(),
        due_time: formData.dueTime,
        priority: formData.taskType,
        completed: false
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();
      
      if (error) {
        console.error('Error adding task:', error);
        toast.error('Failed to create task');
        return false;
      }
      
      // Add the new task to the local state
      const newTask: Task = {
        id: data.id,
        courseName: formData.courseName,
        moduleName: formData.moduleName,
        moduleCode: formData.moduleCode,
        taskType: formData.taskType,
        taskTopic: formData.taskTopic,
        dueDate,
        completed: false,
        createdAt: new Date(data.created_at)
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
  const updateTask = async (id: string, formData: TaskFormData) => {
    if (!user) {
      toast.error('You must be logged in to update tasks');
      return false;
    }
    
    try {
      // Format task for Supabase
      const dueDate = stringToDate(formData.dueDate, formData.dueTime);
      
      const taskData = {
        title: `${formData.courseName} - ${formData.moduleName}`,
        description: `${formData.moduleCode} - ${formData.taskTopic}`,
        due_date: dueDate.toISOString(),
        due_time: formData.dueTime,
        priority: formData.taskType
      };
      
      const { error } = await supabase
        .from('tasks')
        .update(taskData)
        .eq('id', id);
      
      if (error) {
        console.error('Error updating task:', error);
        toast.error('Failed to update task');
        return false;
      }
      
      // Update the task in the local state
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
  const toggleTaskCompletion = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to update tasks');
      return;
    }
    
    try {
      // Find the current task
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      
      // Update in Supabase
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id);
      
      if (error) {
        console.error('Error toggling task completion:', error);
        toast.error('Failed to update task');
        return;
      }
      
      // Update in local state
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id 
            ? { ...task, completed: !task.completed } 
            : task
        )
      );
      
      toast.success(task.completed ? 'Task marked as incomplete' : 'Task marked as complete');
    } catch (error) {
      console.error('Error toggling task completion:', error);
      toast.error('Failed to update task');
    }
  };

  // Delete a task
  const deleteTask = async (id: string) => {
    if (!user) {
      toast.error('You must be logged in to delete tasks');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting task:', error);
        toast.error('Failed to delete task');
        return;
      }
      
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
