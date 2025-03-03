
import { supabase } from '@/integrations/supabase/client';
import { Task, TaskFormData } from '@/types/task';
import { stringToDate } from '@/utils/dateUtils';
import { toast } from 'sonner';
import { transformTaskFromSupabase, transformTaskForSupabase } from './taskTransformer';

export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('due_date', { ascending: true });
    
    if (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load your tasks');
      return [];
    }
    
    return data.map(transformTaskFromSupabase);
  } catch (error) {
    console.error('Error loading tasks:', error);
    toast.error('Failed to load your tasks');
    return [];
  }
};

export const createTask = async (formData: TaskFormData, userId: string): Promise<Task | null> => {
  try {
    const dueDate = stringToDate(formData.dueDate, formData.dueTime);
    const taskData = transformTaskForSupabase(formData, userId);
    
    const { data, error } = await supabase
      .from('tasks')
      .insert(taskData)
      .select()
      .single();
    
    if (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to create task');
      return null;
    }
    
    const newTask: Task = {
      id: data.id,
      courseName: formData.courseName,
      moduleName: formData.moduleName,
      moduleCode: formData.moduleCode,
      taskType: formData.taskType,
      taskTopic: formData.taskTopic,
      dueDate,
      completed: false,
      createdAt: new Date(data.created_at || Date.now())
    };
    
    toast.success('Task created successfully');
    return newTask;
  } catch (error) {
    console.error('Error adding task:', error);
    toast.error('Failed to create task');
    return null;
  }
};

export const updateTaskById = async (id: string, formData: TaskFormData): Promise<boolean> => {
  try {
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
    
    toast.success('Task updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    toast.error('Failed to update task');
    return false;
  }
};

export const toggleTaskCompletionById = async (id: string, currentCompletionStatus: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !currentCompletionStatus })
      .eq('id', id);
    
    if (error) {
      console.error('Error toggling task completion:', error);
      toast.error('Failed to update task');
      return false;
    }
    
    toast.success(currentCompletionStatus ? 'Task marked as incomplete' : 'Task marked as complete');
    return true;
  } catch (error) {
    console.error('Error toggling task completion:', error);
    toast.error('Failed to update task');
    return false;
  }
};

export const deleteTaskById = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      return false;
    }
    
    toast.success('Task deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    toast.error('Failed to delete task');
    return false;
  }
};
