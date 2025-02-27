
import { Task, TaskStatus } from '../types/task';

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const getDaysRemaining = (dueDate: Date): number => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const taskDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  
  const differenceInTime = taskDate.getTime() - today.getTime();
  return Math.ceil(differenceInTime / (1000 * 3600 * 24));
};

export const getTaskStatus = (task: Task): TaskStatus => {
  if (task.completed) return 'green';
  
  const daysRemaining = getDaysRemaining(task.dueDate);
  
  if (daysRemaining < 0) return 'red';
  if (daysRemaining <= 3) return 'yellow';
  return 'green';
};

export const getStatusText = (status: TaskStatus, daysRemaining: number): string => {
  if (status === 'green') {
    return `On track - ${daysRemaining} days remaining`;
  } else if (status === 'yellow') {
    return `Due soon - ${daysRemaining} days remaining`;
  } else {
    if (daysRemaining === 0) {
      return 'Due today';
    } else {
      return `Overdue by ${Math.abs(daysRemaining)} days`;
    }
  }
};

export const stringToDate = (dateStr: string, timeStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  return new Date(year, month - 1, day, hours, minutes);
};
