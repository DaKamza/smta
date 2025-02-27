
export type TaskType = 'Test' | 'Assignment' | 'Presentation';

export type TaskStatus = 'green' | 'yellow' | 'red';

export interface Task {
  id: string;
  courseName: string;
  moduleName: string;
  moduleCode: string;
  taskType: TaskType;
  taskTopic: string;
  dueDate: Date;
  completed: boolean;
  createdAt: Date;
}

export interface TaskFormData {
  courseName: string;
  moduleName: string;
  moduleCode: string;
  taskType: TaskType;
  taskTopic: string;
  dueDate: string;
  dueTime: string;
}
