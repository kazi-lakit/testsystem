import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { ITask } from '../types/task';
import { TaskDetails, TaskService } from '../services/task-service';

interface TaskContextType {
  tasks: TaskDetails[];
  iTasks: ITask[];
  addTask: (task: TaskDetails) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (task: TaskDetails) => void;
  mark: boolean;
  toggleMark: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const [taskService] = useState(() => new TaskService());
  const [tasks, setTasks] = useState<TaskDetails[]>([]);
  const [iTasks, setITasks] = useState<ITask[]>([]);
  const [mark, setMark] = useState(false);

  useEffect(() => {
    const currentTasks = taskService.getTasks();
    setTasks(currentTasks);
    setITasks(taskService.convertTasksToITaskFormat(currentTasks));
  }, [taskService]);

  const toggleMark = useCallback(() => {
    setMark((prev) => !prev);
  }, []);

  const addTask = useCallback(
    (task: TaskDetails) => {
      taskService.addTask(task);
      const updatedTasks = taskService.getTasks();
      setTasks(updatedTasks);
      setITasks(taskService.convertTasksToITaskFormat(updatedTasks));
    },
    [taskService]
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      taskService.deleteTask(taskId);
      const updatedTasks = taskService.getTasks();
      setTasks(updatedTasks);
      setITasks(taskService.convertTasksToITaskFormat(updatedTasks));
    },
    [taskService]
  );

  const updateTask = useCallback(
    (updatedTask: TaskDetails) => {
      const updatedTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task));
      taskService['tasks'] = updatedTasks;
      setTasks(updatedTasks);
      setITasks(taskService.convertTasksToITaskFormat(updatedTasks));
    },
    [taskService, tasks]
  );

  const value = useMemo(
    () => ({
      tasks,
      iTasks,
      addTask,
      deleteTask,
      updateTask,
      mark,
      toggleMark,
    }),
    [tasks, iTasks, addTask, deleteTask, updateTask, mark, toggleMark]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
