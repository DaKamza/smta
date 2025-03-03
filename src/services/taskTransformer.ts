
import { Task, TaskFormData } from '@/types/task';

export const transformTaskFromSupabase = (task: any): Task => {
  return {
    id: task.id,
    courseName: task.title.split(' - ')[0] || '',
    moduleName: task.title.split(' - ')[1] || '',
    moduleCode: task.description.split(' - ')[0] || '',
    taskType: task.priority as any || 'Assignment',
    taskTopic: task.description.split(' - ')[1] || task.description || '',
    dueDate: new Date(task.due_date),
    completed: task.completed,
    createdAt: new Date(task.created_at || Date.now())
  };
};

export const transformTaskForSupabase = (formData: TaskFormData, userId: string) => {
  const dueDate = stringToDate(formData.dueDate, formData.dueTime);
  
  return {
    user_id: userId,
    title: `${formData.courseName} - ${formData.moduleName}`,
    description: `${formData.moduleCode} - ${formData.taskTopic}`,
    due_date: dueDate.toISOString(),
    due_time: formData.dueTime,
    priority: formData.taskType,
    completed: false
  };
};

// Helper function from dateUtils
import { stringToDate } from '@/utils/dateUtils';
