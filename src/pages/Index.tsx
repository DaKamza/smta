
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import { useTasks } from '@/hooks/useTasks';

const Index = () => {
  const { 
    tasks, 
    isLoading, 
    addTask, 
    updateTask, 
    toggleTaskCompletion, 
    deleteTask 
  } = useTasks();

  return (
    <Layout>
      <Dashboard
        tasks={tasks}
        isLoading={isLoading}
        onAddTask={addTask}
        onUpdateTask={updateTask}
        onDeleteTask={deleteTask}
        onToggleTaskCompletion={toggleTaskCompletion}
      />
    </Layout>
  );
};

export default Index;
