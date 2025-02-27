
import { useState, useEffect } from 'react';
import { Task, TaskFormData, TaskType } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  initialData?: Task;
  title: string;
}

const defaultFormData: TaskFormData = {
  courseName: '',
  moduleName: '',
  moduleCode: '',
  taskType: 'Assignment',
  taskTopic: '',
  dueDate: '',
  dueTime: ''
};

const TaskForm = ({ open, onClose, onSubmit, initialData, title }: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>(defaultFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with initial data if provided
  useEffect(() => {
    if (initialData) {
      const dueDate = initialData.dueDate;
      const formattedDate = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}`;
      const formattedTime = `${String(dueDate.getHours()).padStart(2, '0')}:${String(dueDate.getMinutes()).padStart(2, '0')}`;
      
      setFormData({
        courseName: initialData.courseName,
        moduleName: initialData.moduleName,
        moduleCode: initialData.moduleCode,
        taskType: initialData.taskType,
        taskTopic: initialData.taskTopic,
        dueDate: formattedDate,
        dueTime: formattedTime
      });
    } else {
      // Reset form when opening a new task
      setFormData(defaultFormData);
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: keyof TaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Course name is required';
    }
    
    if (!formData.moduleName.trim()) {
      newErrors.moduleName = 'Module name is required';
    }
    
    if (!formData.moduleCode.trim()) {
      newErrors.moduleCode = 'Module code is required';
    }
    
    if (!formData.taskTopic.trim()) {
      newErrors.taskTopic = 'Task topic is required';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (!formData.dueTime) {
      newErrors.dueTime = 'Due time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const taskTypes: TaskType[] = ['Test', 'Assignment', 'Presentation'];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-xl p-0 overflow-hidden">
        <div className="absolute right-4 top-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-6 w-6 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <DialogDescription>
            Fill in the details for your academic task.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-6 pb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  name="courseName"
                  placeholder="e.g., Bachelor of Commerce"
                  value={formData.courseName}
                  onChange={handleChange}
                  className={errors.courseName ? 'border-destructive' : ''}
                />
                {errors.courseName && (
                  <p className="text-destructive text-xs">{errors.courseName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="moduleName">Module Name</Label>
                <Input
                  id="moduleName"
                  name="moduleName"
                  placeholder="e.g., Financial Accounting"
                  value={formData.moduleName}
                  onChange={handleChange}
                  className={errors.moduleName ? 'border-destructive' : ''}
                />
                {errors.moduleName && (
                  <p className="text-destructive text-xs">{errors.moduleName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="moduleCode">Module Code</Label>
                <Input
                  id="moduleCode"
                  name="moduleCode"
                  placeholder="e.g., FAC101"
                  value={formData.moduleCode}
                  onChange={handleChange}
                  className={errors.moduleCode ? 'border-destructive' : ''}
                />
                {errors.moduleCode && (
                  <p className="text-destructive text-xs">{errors.moduleCode}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="taskType">Task Type</Label>
                <Select 
                  value={formData.taskType} 
                  onValueChange={(value) => handleSelectChange('taskType', value as TaskType)}
                >
                  <SelectTrigger className={errors.taskType ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.taskType && (
                  <p className="text-destructive text-xs">{errors.taskType}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="taskTopic">Task Topic</Label>
                <Input
                  id="taskTopic"
                  name="taskTopic"
                  placeholder="e.g., Financial Statements Analysis"
                  value={formData.taskTopic}
                  onChange={handleChange}
                  className={errors.taskTopic ? 'border-destructive' : ''}
                />
                {errors.taskTopic && (
                  <p className="text-destructive text-xs">{errors.taskTopic}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={errors.dueDate ? 'border-destructive' : ''}
                />
                {errors.dueDate && (
                  <p className="text-destructive text-xs">{errors.dueDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueTime">Due Time</Label>
                <Input
                  id="dueTime"
                  name="dueTime"
                  type="time"
                  value={formData.dueTime}
                  onChange={handleChange}
                  className={errors.dueTime ? 'border-destructive' : ''}
                />
                {errors.dueTime && (
                  <p className="text-destructive text-xs">{errors.dueTime}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="submit" className="w-full">
              {initialData ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
