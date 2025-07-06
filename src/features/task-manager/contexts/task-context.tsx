import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import {
  Assignee,
  assignees,
  initialTasks,
  Tag,
  tags,
  TaskDetails,
} from '../services/task-service';
import { ITask, ITaskManagerColumn } from '../types/task';

/**
 * TaskContext
 *
 * A context provider for managing tasks and columns in a task manager application.
 * This context supports:
 * - Managing tasks and columns
 * - Filtering tasks based on various criteria
 * - Adding, updating, and deleting tasks and columns
 * - Drag-and-drop functionality for reordering tasks
 *
 * Features:
 * - Provides a centralized state for tasks and columns
 * - Supports filtering by search query, priority, status, assignees, tags, and due dates
 * - Includes utility functions for managing task details, comments, attachments, and more
 *
 * Props:
 * @param {ReactNode} children - The child components that will consume the context
 *
 * @returns {JSX.Element} The task context provider
 *
 * @example
 * // Basic usage
 * <TaskProvider>
 *   <TaskManager />
 * </TaskProvider>
 */

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB');
}

interface TaskContextType {
  taskDetails: TaskDetails[];
  listTasks: ITask[];
  columnTasks: ITaskManagerColumn[];
  setColumnTasks: React.Dispatch<React.SetStateAction<ITaskManagerColumn[]>>;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  updateFilter: (filters: {
    searchQuery?: string;
    priorities?: string[];
    statuses?: string[];
    assignees?: string[];
    tags?: string[];
    dueDate?: { from: Date | null; to: Date | null };
  }) => void;
  resetFilters: () => void;

  addTask: (task: Partial<TaskDetails>) => string;
  updateTask: (taskId: string, updates: Partial<TaskDetails>) => void;
  deleteTask: (taskId: string) => void;

  updateTaskStatus: (taskId: string, isCompleted: boolean) => void;
  moveTask: (taskId: string, newStatus: string) => void;

  addColumn: (title: string) => string;
  updateColumn: (columnId: string, title: string) => void;
  deleteColumn: (columnId: string) => void;

  reorderTasks: (sourceIndex: number, destinationIndex: number, status?: string) => void;

  addComment: (taskId: string, author: string, text: string) => void;
  addAttachment: (
    taskId: string,
    name: string,
    size: string,
    type: 'pdf' | 'image' | 'other'
  ) => void;
  addAssignee: (taskId: string, name: string, avatar: string) => void;
  addTag: (taskId: string, label: string) => void;

  removeComment: (taskId: string, commentId: string) => void;
  removeAttachment: (taskId: string, attachmentId: string) => void;
  removeAssignee: (taskId: string, assigneeId: string) => void;
  removeTag: (taskId: string, tagId: string) => void;

  priorities: string[];
  assignees: Assignee[];
  tags: Tag[];
  statuses: string[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [originalTasks, setOriginalTasks] = useState<TaskDetails[]>(initialTasks);
  const [taskDetails, setTaskDetails] = useState<TaskDetails[]>(initialTasks);
  const [nextTaskId, setNextTaskId] = useState<number>(
    Math.max(...initialTasks.map((task) => parseInt(task.id))) + 1
  );
  const [nextColumnId, setNextColumnId] = useState<number>(4);

  const [listTasks, setListTasks] = useState<ITask[]>([]);

  const [columnTasks, setColumnTasks] = useState<ITaskManagerColumn[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDueDate, setSelectedDueDate] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null,
  });

  const updateFilter = useCallback(
    (filters: {
      searchQuery?: string;
      priorities?: string[];
      statuses?: string[];
      assignees?: string[];
      tags?: string[];
      dueDate?: { from: Date | null; to: Date | null };
    }) => {
      if (filters.searchQuery !== undefined) setSearchQuery(filters.searchQuery);
      if (filters.priorities !== undefined) setSelectedPriorities(filters.priorities);
      if (filters.statuses !== undefined) setSelectedStatuses(filters.statuses);
      if (filters.assignees !== undefined) setSelectedAssignees(filters.assignees);
      if (filters.tags !== undefined) setSelectedTags(filters.tags);
      if (filters.dueDate !== undefined) setSelectedDueDate(filters.dueDate);
    },
    [
      setSearchQuery,
      setSelectedPriorities,
      setSelectedStatuses,
      setSelectedAssignees,
      setSelectedTags,
      setSelectedDueDate,
    ]
  );

  useEffect(() => {
    const filteredTasks = originalTasks.filter((task) => {
      const matchesSearchQuery =
        !searchQuery || task.title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        selectedPriorities.length === 0 || selectedPriorities.includes(task.priority);

      const matchesStatus =
        selectedStatuses.length === 0 || selectedStatuses.includes(task.section);

      const matchesAssignee =
        selectedAssignees.length === 0 ||
        task.assignees.some((assignee) => selectedAssignees.includes(assignee.id));

      const matchesTags =
        selectedTags.length === 0 || task.tags.some((tag) => selectedTags.includes(tag.id));

      const matchesDueDate =
        (!selectedDueDate.from && !selectedDueDate.to) ||
        (task.dueDate &&
          (!selectedDueDate.from || task.dueDate >= selectedDueDate.from) &&
          (!selectedDueDate.to || task.dueDate <= selectedDueDate.to));

      return (
        matchesSearchQuery &&
        matchesPriority &&
        matchesStatus &&
        matchesAssignee &&
        matchesTags &&
        matchesDueDate
      );
    });

    setTaskDetails(filteredTasks);
  }, [
    searchQuery,
    selectedPriorities,
    selectedStatuses,
    selectedAssignees,
    selectedTags,
    selectedDueDate,
    originalTasks,
  ]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedPriorities([]);
    setSelectedStatuses([]);
    setSelectedAssignees([]);
    setSelectedTags([]);
    setSelectedDueDate({ from: null, to: null });
    setTaskDetails(originalTasks);
  }, [originalTasks]);

  useEffect(() => {
    const newListTasks = taskDetails.map((task) => ({
      id: task.id,
      content: task.title,
      priority: task.priority,
      tags: task.tags.map((tag) => tag.label),
      dueDate: task.dueDate ? formatDate(task.dueDate) : undefined,
      comments: task.comments.length,
      attachments: task.attachments.length,
      assignees: task.assignees.map((assignee) => assignee.name),
      status: task.section,
      isCompleted: task.isCompleted,
    }));

    setListTasks(newListTasks);
  }, [taskDetails]);

  useEffect(() => {
    const uniqueStatuses = Array.from(new Set(listTasks.map((task) => task.status)));

    const newColumnTasks: ITaskManagerColumn[] = columnTasks.map((column) => ({
      ...column,
      tasks: listTasks.filter((task) => task.status === column.title),
    }));

    uniqueStatuses.forEach((status) => {
      if (!newColumnTasks.find((col) => col.title === status)) {
        newColumnTasks.push({
          id: (newColumnTasks.length + 1).toString(),
          title: status ?? 'Unknown',
          tasks: listTasks.filter((task) => task.status === status),
        });
      }
    });

    setColumnTasks(newColumnTasks);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listTasks]);

  const addTask = useCallback(
    (task: Partial<TaskDetails>): string => {
      const id = nextTaskId.toString();
      const newTask: TaskDetails = {
        id,
        title: task.title ?? 'New Task',
        mark: task.mark || false,
        section: task.section ?? 'To Do',
        priority: task.priority ?? '',
        dueDate: task.dueDate || null,
        assignees: task.assignees || [],
        description: task.description ?? '',
        tags: task.tags || [],
        attachments: task.attachments || [],
        comments: task.comments || [],
        isCompleted: task.isCompleted || false,
      };

      setTaskDetails((prev) => [newTask, ...prev]);
      setOriginalTasks((prev) => [newTask, ...prev]);
      setNextTaskId((prev) => prev + 1);
      return id;
    },
    [nextTaskId]
  );

  const updateTask = useCallback((taskId: string, updates: Partial<TaskDetails>): void => {
    setTaskDetails((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
    setOriginalTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  }, []);

  const deleteTask = useCallback((taskId: string): void => {
    setTaskDetails((prev) => prev.filter((task) => task.id !== taskId));
    setOriginalTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  const updateTaskStatus = useCallback((taskId: string, isCompleted: boolean): void => {
    setTaskDetails((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, isCompleted } : task))
    );
    setOriginalTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, isCompleted } : task))
    );
  }, []);

  const moveTask = useCallback((taskId: string, newStatus: string): void => {
    setTaskDetails((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, section: newStatus } : task))
    );
    setOriginalTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, section: newStatus } : task))
    );
  }, []);

  const addColumn = useCallback(
    (title: string): string => {
      const id = nextColumnId.toString();
      setColumnTasks((prev) => [
        ...prev,
        {
          id,
          title,
          tasks: [],
        },
      ]);
      setNextColumnId((prev) => prev + 1);
      return id;
    },
    [nextColumnId]
  );

  const updateColumn = useCallback(
    (columnId: string, title: string): void => {
      const columnToUpdate = columnTasks.find((col) => col.id === columnId);
      const oldTitle = columnToUpdate?.title;

      setColumnTasks((prev) =>
        prev.map((column) => (column.id === columnId ? { ...column, title } : column))
      );

      const updateTaskSection = (task: TaskDetails) => {
        if (task.section === oldTitle) {
          return { ...task, section: title };
        }
        return task;
      };

      setTaskDetails((prev) => prev.map(updateTaskSection));
      setOriginalTasks((prev) => prev.map(updateTaskSection));
    },
    [columnTasks]
  );

  const deleteColumn = useCallback(
    (columnId: string): void => {
      const columnTitle = columnTasks.find((col) => col.id === columnId)?.title;
      setColumnTasks((prev) => prev.filter((column) => column.id !== columnId));
      if (columnTitle) {
        setTaskDetails((prev) => prev.filter((task) => task.section !== columnTitle));
        setOriginalTasks((prev) => prev.filter((task) => task.section !== columnTitle));
      }
    },
    [columnTasks]
  );

  const reorderTasks = useCallback(
    (sourceIndex: number, destinationIndex: number, status?: string): void => {
      const tasksToReorder = status
        ? [...listTasks].filter((task) => task.status === status)
        : [...listTasks];

      const reorderedTasks = arrayMove(tasksToReorder, sourceIndex, destinationIndex);

      if (status) {
        const otherTasks = listTasks.filter((task) => task.status !== status);
        setListTasks([...reorderedTasks, ...otherTasks]);
      } else {
        setListTasks(reorderedTasks);
      }
    },
    [listTasks]
  );

  const addComment = useCallback((taskId: string, author: string, text: string): void => {
    setTaskDetails((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newComment = {
            id: `comment-${Date.now()}`,
            author,
            timestamp: new Date().toLocaleString('en-GB'),
            text,
          };
          return {
            ...task,
            comments: [...task.comments, newComment],
          };
        }
        return task;
      })
    );
  }, []);

  const addAttachment = useCallback(
    (taskId: string, name: string, size: string, type: 'pdf' | 'image' | 'other'): void => {
      setTaskDetails((prev) =>
        prev.map((task) => {
          if (task.id === taskId) {
            const newAttachment = {
              id: `attachment-${Date.now()}`,
              name,
              size,
              type,
            };
            return {
              ...task,
              attachments: [...task.attachments, newAttachment],
            };
          }
          return task;
        })
      );
    },
    []
  );

  const addAssignee = useCallback((taskId: string, name: string, avatar: string): void => {
    setTaskDetails((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newAssignee = {
            id: `assignee-${Date.now()}`,
            name,
            avatar,
          };
          return {
            ...task,
            assignees: [...task.assignees, newAssignee],
          };
        }
        return task;
      })
    );
  }, []);

  const addTag = useCallback((taskId: string, label: string): void => {
    setTaskDetails((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const newTag = {
            id: `tag-${Date.now()}`,
            label,
          };
          return {
            ...task,
            tags: [...task.tags, newTag],
          };
        }
        return task;
      })
    );
  }, []);

  const removeComment = useCallback((taskId: string, commentId: string): void => {
    const filterComments = (task: TaskDetails) => {
      if (task.id === taskId) {
        return {
          ...task,
          comments: task.comments.filter((comment) => comment.id !== commentId),
        };
      }
      return task;
    };

    setTaskDetails((prev) => prev.map(filterComments));
  }, []);

  const removeAttachment = useCallback((taskId: string, attachmentId: string): void => {
    const filterAttachments = (task: TaskDetails) => {
      if (task.id === taskId) {
        return {
          ...task,
          attachments: task.attachments.filter((attachment) => attachment.id !== attachmentId),
        };
      }
      return task;
    };

    setTaskDetails((prev) => prev.map(filterAttachments));
  }, []);

  const removeAssignee = useCallback((taskId: string, assigneeId: string): void => {
    const filterAssignees = (task: TaskDetails) => {
      if (task.id === taskId) {
        return {
          ...task,
          assignees: task.assignees.filter((assignee) => assignee.id !== assigneeId),
        };
      }
      return task;
    };

    setTaskDetails((prev) => prev.map(filterAssignees));
  }, []);

  const removeTag = useCallback((taskId: string, tagId: string): void => {
    const filterTags = (task: TaskDetails) => {
      if (task.id === taskId) {
        return {
          ...task,
          tags: task.tags.filter((tag) => tag.id !== tagId),
        };
      }
      return task;
    };

    setTaskDetails((prev) => prev.map(filterTags));
  }, []);

  const priorities = Array.from(new Set(originalTasks.map((task) => task.priority))).filter(
    Boolean
  );

  const statuses = Array.from(new Set(originalTasks.map((task) => task.section))).filter(Boolean);

  const value = useMemo(
    () => ({
      taskDetails,
      listTasks,
      columnTasks,
      searchQuery,
      setSearchQuery,
      updateFilter,
      resetFilters,
      addTask,
      updateTask,
      deleteTask,
      updateTaskStatus,
      moveTask,
      addColumn,
      updateColumn,
      deleteColumn,
      reorderTasks,
      addComment,
      addAttachment,
      addAssignee,
      addTag,
      removeComment,
      removeAttachment,
      removeAssignee,
      removeTag,
      setColumnTasks,
      priorities,
      assignees,
      tags,
      statuses,
    }),
    [
      taskDetails,
      listTasks,
      columnTasks,
      searchQuery,
      setSearchQuery,
      updateFilter,
      resetFilters,
      addTask,
      updateTask,
      deleteTask,
      updateTaskStatus,
      moveTask,
      addColumn,
      updateColumn,
      deleteColumn,
      reorderTasks,
      addComment,
      addAttachment,
      addAssignee,
      addTag,
      removeComment,
      removeAttachment,
      removeAssignee,
      removeTag,
      setColumnTasks,
      priorities,
      statuses,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error();
  }
  return context;
};
