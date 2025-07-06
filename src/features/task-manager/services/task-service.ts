import { ITask } from '../types/task';

export interface Assignee {
  id: string;
  name: string;
  avatar: string;
}

export interface Tag {
  id: string;
  label: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'other';
}

export interface Comment {
  id: string;
  author: string;
  timestamp: string;
  text: string;
}

export interface TaskDetails {
  isCompleted: boolean;
  id: string;
  title: string;
  mark: boolean;
  section: string;
  priority: string;
  dueDate: Date | null;
  assignees: Assignee[];
  description: string;
  tags: Tag[];
  attachments: Attachment[];
  comments: Comment[];
}

const CONSTANTS = {
  AVATAR_URL:
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/avator.JPG-eY44OKHv1M9ZlUnG6sSFJSz2UMlimG.jpeg',
  DESCRIPTION: `1. Create engaging visual for error page.
2. Add search bar or redirection links.
3. Include humor or creativity to reduce bounce rate.
4. Make design consistent with branding.`,
  DATES: {
    BASE_YEAR: 2025,
    BASE_MONTH: 3, // April (0-indexed)
    BASE_DAY: 1,
  },
  SECTIONS: {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done',
  },
  PRIORITIES: {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
  },
  TIMESTAMPS: {
    MARCH_20_12: '20.03.2025, 12:00',
    MARCH_20_13: '20.03.2025, 13:15',
    MARCH_20_14: '20.03.2025, 14:00',
    MARCH_20_17: '20.03.2025, 17:15',
    MARCH_18_16: '18/03/2025, 16:00',
    MARCH_19_15: '19.03.2025, 15:30',
    MARCH_21_10: '21.03.2025, 10:30',
    MARCH_21_11: '21.03.2025, 11:45',
    MARCH_22_09: '22.03.2025, 09:20',
    MARCH_22_10: '22.03.2025, 10:10',
    MARCH_22_09_45: '22.03.2025, 09:45',
    MARCH_20_14_30: '20/03/2025, 14:30',
  },
} as const;

const EntityFactory = {
  createAssignee: (id: string, name: string): Assignee => ({
    id,
    name,
    avatar: CONSTANTS.AVATAR_URL,
  }),

  createTag: (id: string, label: string): Tag => ({ id, label }),

  createAttachment: (
    id: string,
    name: string,
    size: string,
    type: 'pdf' | 'image' | 'other'
  ): Attachment => ({
    id,
    name,
    size,
    type,
  }),

  createComment: (id: string, author: string, timestamp: string, text: string): Comment => ({
    id,
    author,
    timestamp,
    text,
  }),

  createDate: (year: number, month: number, day: number): Date => new Date(year, month, day),
};

const ATTACHMENTS_LIBRARY = {
  DESIGN_SPEC_PDF: EntityFactory.createAttachment('1', 'design-spec.pdf', '2 MB', 'pdf'),
  SCREENSHOT_PNG: EntityFactory.createAttachment('2', 'screenshot.png', '1.5 MB', 'image'),
  DASHBOARD_ANALYTICS_FIG: EntityFactory.createAttachment(
    '1',
    'dashboard-analytics.fig',
    '3.2 MB',
    'pdf'
  ),
  WIREFRAME_PNG: EntityFactory.createAttachment('2', 'wireframe.png', '950 KB', 'image'),
  CI_CD_PIPELINE_YML: EntityFactory.createAttachment('1', 'ci-cd-pipeline.yml', '45 KB', 'image'),
  TEST_CASES_XLSX: EntityFactory.createAttachment('1', 'test-cases.xlsx', '120 KB', 'other'),
  STRIPE_DOCS_PDF: EntityFactory.createAttachment('1', 'stripe-docs.pdf', '1.1 MB', 'pdf'),
  INVOICE_TEMPLATE_PNG: EntityFactory.createAttachment(
    '2',
    'invoice-template.png',
    '780 KB',
    'image'
  ),
  NOTIFICATION_FLOWCHART_PDF: EntityFactory.createAttachment(
    '1',
    'notification-flowchart.pdf',
    '550 KB',
    'pdf'
  ),
  SEO_CHECKLIST_TXT: EntityFactory.createAttachment('1', 'seo-checklist.txt', '40 KB', 'pdf'),
  MIGRATION_PLAN_DOCX: EntityFactory.createAttachment(
    '1',
    'migration-plan.docx',
    '1.2 MB',
    'image'
  ),
  THEME_GUIDE_MD: EntityFactory.createAttachment('1', 'theme-guide.md', '70 KB', 'image'),
  COMPLIANCE_CHECKLIST_PDF: EntityFactory.createAttachment(
    '1',
    'compliance-checklist.pdf',
    '300 KB',
    'pdf'
  ),
  FEEDBACK_SUMMARY_CSV: EntityFactory.createAttachment(
    '1',
    'feedback-summary.csv',
    '250 KB',
    'image'
  ),
};

const COMMENTS_LIBRARY = {
  BLOCK_SMITH_REVIEW: EntityFactory.createComment(
    '1',
    'Block Smith',
    CONSTANTS.TIMESTAMPS.MARCH_20_12,
    'Please check, review & verify.'
  ),
  JANE_DOE_APPROVAL: EntityFactory.createComment(
    '2',
    'Jane Doe',
    CONSTANTS.TIMESTAMPS.MARCH_20_13,
    'Looks good to me. Ready for deployment.'
  ),
  SARA_KIM_DRAFT: EntityFactory.createComment(
    '1',
    'Sara Kim',
    CONSTANTS.TIMESTAMPS.MARCH_21_10,
    'Started working on the visual draft.'
  ),
  JANE_DOE_PADDING: EntityFactory.createComment(
    '2',
    'Jane Doe',
    CONSTANTS.TIMESTAMPS.MARCH_21_11,
    'Add some padding around charts.'
  ),
  ALEX_WANG_CI: EntityFactory.createComment(
    '1',
    'Alex Wang',
    CONSTANTS.TIMESTAMPS.MARCH_20_14,
    'CI pipeline working. CD config in progress.'
  ),
  EMILY_CLARK_TEST: EntityFactory.createComment(
    '1',
    'Emily Clark',
    CONSTANTS.TIMESTAMPS.MARCH_19_15,
    'Tested 15/20 edge cases. 5 more pending.'
  ),
  LEO_CHAN_WEBHOOK: EntityFactory.createComment(
    '1',
    'Leo Chan',
    CONSTANTS.TIMESTAMPS.MARCH_22_09,
    'Webhook config tested. Awaiting approval.'
  ),
  NATALIE_PEREZ_MOBILE: EntityFactory.createComment(
    '1',
    'Natalie Perez',
    CONSTANTS.TIMESTAMPS.MARCH_22_10,
    'Need design review for mobile toast layout.'
  ),
  IVY_THOMPSON_SEO: EntityFactory.createComment(
    '1',
    'Ivy Thompson',
    CONSTANTS.TIMESTAMPS.MARCH_21_11,
    'Added structured data markup.'
  ),
  CARLOS_MENDES_SCHEMA: EntityFactory.createComment(
    '1',
    'Carlos Mendes',
    CONSTANTS.TIMESTAMPS.MARCH_20_17,
    'Schema comparison draft ready.'
  ),
  PRIYA_SINGH_DARK_MODE: EntityFactory.createComment(
    '1',
    'Priya Singh',
    CONSTANTS.TIMESTAMPS.MARCH_22_09_45,
    'Toggle logic implemented. Testing styles now.'
  ),
  OMAR_RAZA_COMPLIANCE: EntityFactory.createComment(
    '1',
    'Omar Raza',
    CONSTANTS.TIMESTAMPS.MARCH_20_14_30,
    'Cookies and consent banner updated.'
  ),
  MINA_PARK_FEEDBACK: EntityFactory.createComment(
    '1',
    'Mina Park',
    CONSTANTS.TIMESTAMPS.MARCH_18_16,
    'Finished compiling user suggestions.'
  ),
};

export const assignees: Assignee[] = [
  EntityFactory.createAssignee('1', 'Aaron Green'),
  EntityFactory.createAssignee('2', 'Adrian Müller'),
  EntityFactory.createAssignee('3', 'Blocks Smith'),
  EntityFactory.createAssignee('4', 'Sarah Pavan'),
  EntityFactory.createAssignee('5', 'Sara Kim'),
  EntityFactory.createAssignee('6', 'Lio Chan'),
];

export const tags: Tag[] = [
  EntityFactory.createTag('calendar', 'Calendar'),
  EntityFactory.createTag('ui-ux', 'UI/UX'),
  EntityFactory.createTag('frontend', 'Frontend'),
  EntityFactory.createTag('design', 'Design'),
  EntityFactory.createTag('accessibility', 'Accessibility'),
  EntityFactory.createTag('mobile', 'Mobile'),
  EntityFactory.createTag('responsive', 'Responsive'),
  EntityFactory.createTag('performance', 'Performance'),
  EntityFactory.createTag('usability', 'Usability'),
];

const DataHelpers = {
  getAssigneesByIds: (ids: string[]): Assignee[] => {
    return assignees.filter((assignee) => ids.includes(assignee.id));
  },

  getTagsByIds: (ids: string[]): Tag[] => {
    return tags.filter((tag) => ids.includes(tag.id));
  },
};

const TAG_COMBINATIONS = {
  CALENDAR_UI: ['calendar', 'ui-ux'],
  UI_USABILITY: ['ui-ux', 'usability'],
  DESIGN_ONLY: ['design'],
  FRONTEND_ONLY: ['frontend'],
  ACCESSIBILITY_FRONTEND: ['accessibility', 'frontend'],
  UI_ACCESSIBILITY: ['ui-ux', 'accessibility'],
};

interface CreateTaskConfig {
  id: string;
  title: string;
  section: string;
  priority: string;
  dueDate: Date | null;
  assigneeIds: string[];
  tagIds: string[];
  attachments?: Attachment[];
  comments?: Comment[];
  mark?: boolean;
  isCompleted?: boolean;
}

const createTask = (config: CreateTaskConfig): TaskDetails => ({
  id: config.id,
  title: config.title,
  mark: config.mark ?? false,
  section: config.section,
  priority: config.priority,
  dueDate: config.dueDate,
  assignees: DataHelpers.getAssigneesByIds(config.assigneeIds),
  description: CONSTANTS.DESCRIPTION,
  tags: DataHelpers.getTagsByIds(config.tagIds),
  attachments: config.attachments ?? [],
  comments: config.comments ?? [],
  isCompleted: config.isCompleted ?? false,
});

const TASK_DEFINITIONS: CreateTaskConfig[] = [
  {
    id: '1',
    title: 'Update Calendar UI',
    section: CONSTANTS.SECTIONS.TODO,
    priority: CONSTANTS.PRIORITIES.MEDIUM,
    dueDate: EntityFactory.createDate(CONSTANTS.DATES.BASE_YEAR, CONSTANTS.DATES.BASE_MONTH, 1),
    assigneeIds: ['1', '2'],
    tagIds: TAG_COMBINATIONS.CALENDAR_UI,
    attachments: [ATTACHMENTS_LIBRARY.DESIGN_SPEC_PDF, ATTACHMENTS_LIBRARY.SCREENSHOT_PNG],
    comments: [COMMENTS_LIBRARY.BLOCK_SMITH_REVIEW, COMMENTS_LIBRARY.JANE_DOE_APPROVAL],
  },
  {
    id: '2',
    title: 'Fix Login Bug',
    section: CONSTANTS.SECTIONS.IN_PROGRESS,
    priority: CONSTANTS.PRIORITIES.HIGH,
    dueDate: EntityFactory.createDate(CONSTANTS.DATES.BASE_YEAR, CONSTANTS.DATES.BASE_MONTH, 2),
    assigneeIds: ['3'],
    tagIds: TAG_COMBINATIONS.UI_USABILITY,
    attachments: [ATTACHMENTS_LIBRARY.DESIGN_SPEC_PDF, ATTACHMENTS_LIBRARY.SCREENSHOT_PNG],
    comments: [COMMENTS_LIBRARY.BLOCK_SMITH_REVIEW, COMMENTS_LIBRARY.JANE_DOE_APPROVAL],
    mark: true,
    isCompleted: true,
  },
  {
    id: '3',
    title: 'Design Dashboard Analytics',
    section: CONSTANTS.SECTIONS.TODO,
    priority: CONSTANTS.PRIORITIES.HIGH,
    dueDate: EntityFactory.createDate(CONSTANTS.DATES.BASE_YEAR, CONSTANTS.DATES.BASE_MONTH, 3),
    assigneeIds: ['4'],
    tagIds: TAG_COMBINATIONS.DESIGN_ONLY,
    attachments: [ATTACHMENTS_LIBRARY.DASHBOARD_ANALYTICS_FIG, ATTACHMENTS_LIBRARY.WIREFRAME_PNG],
    comments: [COMMENTS_LIBRARY.SARA_KIM_DRAFT, COMMENTS_LIBRARY.JANE_DOE_PADDING],
  },
  {
    id: '4',
    title: 'Set Up CI/CD Pipeline',
    section: CONSTANTS.SECTIONS.IN_PROGRESS,
    priority: CONSTANTS.PRIORITIES.HIGH,
    dueDate: EntityFactory.createDate(CONSTANTS.DATES.BASE_YEAR, CONSTANTS.DATES.BASE_MONTH, 4),
    assigneeIds: ['5'],
    tagIds: TAG_COMBINATIONS.UI_USABILITY,
    attachments: [ATTACHMENTS_LIBRARY.CI_CD_PIPELINE_YML],
    comments: [COMMENTS_LIBRARY.ALEX_WANG_CI],
  },
  {
    id: '5',
    title: 'QA: Profile Update Flow',
    section: CONSTANTS.SECTIONS.DONE,
    priority: CONSTANTS.PRIORITIES.MEDIUM,
    dueDate: EntityFactory.createDate(CONSTANTS.DATES.BASE_YEAR, CONSTANTS.DATES.BASE_MONTH, 6),
    assigneeIds: ['6'],
    tagIds: TAG_COMBINATIONS.UI_USABILITY,
    attachments: [ATTACHMENTS_LIBRARY.TEST_CASES_XLSX],
    comments: [COMMENTS_LIBRARY.EMILY_CLARK_TEST],
  },
  {
    id: '6',
    title: 'Integrate Stripe Payments',
    section: CONSTANTS.SECTIONS.DONE,
    priority: CONSTANTS.PRIORITIES.HIGH,
    dueDate: EntityFactory.createDate(CONSTANTS.DATES.BASE_YEAR, CONSTANTS.DATES.BASE_MONTH, 9),
    assigneeIds: ['6'],
    tagIds: TAG_COMBINATIONS.UI_USABILITY,
    attachments: [ATTACHMENTS_LIBRARY.STRIPE_DOCS_PDF, ATTACHMENTS_LIBRARY.INVOICE_TEMPLATE_PNG],
    comments: [COMMENTS_LIBRARY.LEO_CHAN_WEBHOOK],
  },
  {
    id: '7',
    title: 'Update Notification System',
    section: CONSTANTS.SECTIONS.TODO,
    priority: CONSTANTS.PRIORITIES.MEDIUM,
    dueDate: EntityFactory.createDate(CONSTANTS.DATES.BASE_YEAR, CONSTANTS.DATES.BASE_MONTH, 10),
    assigneeIds: ['3', '4', '5', '6'],
    tagIds: TAG_COMBINATIONS.FRONTEND_ONLY,
    attachments: [ATTACHMENTS_LIBRARY.NOTIFICATION_FLOWCHART_PDF],
    comments: [COMMENTS_LIBRARY.NATALIE_PEREZ_MOBILE],
  },
  {
    id: '8',
    title: 'Optimize Landing Page SEO',
    section: CONSTANTS.SECTIONS.IN_PROGRESS,
    priority: CONSTANTS.PRIORITIES.LOW,
    dueDate: EntityFactory.createDate(CONSTANTS.DATES.BASE_YEAR, 2, 1), // March
    assigneeIds: ['6'],
    tagIds: TAG_COMBINATIONS.ACCESSIBILITY_FRONTEND,
    attachments: [ATTACHMENTS_LIBRARY.SEO_CHECKLIST_TXT],
    comments: [COMMENTS_LIBRARY.IVY_THOMPSON_SEO],
  },
  {
    id: '9',
    title: 'Database Migration Plan',
    section: CONSTANTS.SECTIONS.DONE,
    priority: CONSTANTS.PRIORITIES.HIGH,
    dueDate: EntityFactory.createDate(CONSTANTS.DATES.BASE_YEAR, CONSTANTS.DATES.BASE_MONTH, 1),
    assigneeIds: ['3'],
    tagIds: TAG_COMBINATIONS.UI_USABILITY,
    attachments: [ATTACHMENTS_LIBRARY.MIGRATION_PLAN_DOCX],
    comments: [COMMENTS_LIBRARY.CARLOS_MENDES_SCHEMA],
  },
  {
    id: '10',
    title: 'Implement Dark Mode',
    section: CONSTANTS.SECTIONS.TODO,
    priority: CONSTANTS.PRIORITIES.MEDIUM,
    dueDate: EntityFactory.createDate(CONSTANTS.DATES.BASE_YEAR, CONSTANTS.DATES.BASE_MONTH, 1),
    assigneeIds: ['5'],
    tagIds: TAG_COMBINATIONS.UI_ACCESSIBILITY,
    attachments: [ATTACHMENTS_LIBRARY.THEME_GUIDE_MD],
    comments: [COMMENTS_LIBRARY.PRIYA_SINGH_DARK_MODE],
  },
  {
    id: '11',
    title: 'Review Legal Compliance',
    section: CONSTANTS.SECTIONS.IN_PROGRESS,
    priority: CONSTANTS.PRIORITIES.HIGH,
    dueDate: EntityFactory.createDate(CONSTANTS.DATES.BASE_YEAR, CONSTANTS.DATES.BASE_MONTH, 1),
    assigneeIds: ['4'],
    tagIds: TAG_COMBINATIONS.UI_USABILITY,
    attachments: [ATTACHMENTS_LIBRARY.COMPLIANCE_CHECKLIST_PDF],
    comments: [COMMENTS_LIBRARY.OMAR_RAZA_COMPLIANCE],
  },
  {
    id: '12',
    title: 'User Feedback Report',
    section: CONSTANTS.SECTIONS.DONE,
    priority: CONSTANTS.PRIORITIES.LOW,
    dueDate: EntityFactory.createDate(CONSTANTS.DATES.BASE_YEAR, CONSTANTS.DATES.BASE_MONTH, 1),
    assigneeIds: ['6'],
    tagIds: TAG_COMBINATIONS.UI_USABILITY,
    attachments: [ATTACHMENTS_LIBRARY.FEEDBACK_SUMMARY_CSV],
    comments: [COMMENTS_LIBRARY.MINA_PARK_FEEDBACK],
    mark: true,
    isCompleted: true,
  },
];

export const initialTasks: TaskDetails[] = TASK_DEFINITIONS.map(createTask);

export class TaskService {
  private tasks: TaskDetails[];

  constructor() {
    this.tasks = [...initialTasks];
  }

  getTasks(): TaskDetails[] {
    return this.tasks;
  }

  addTask(newTask: TaskDetails): void {
    this.tasks.push(newTask);
  }

  deleteTask(taskId: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  convertTasksToITaskFormat = (tasks: TaskDetails[]): ITask[] => {
    const statusMap: Record<string, 'todo' | 'inprogress' | 'done'> = {
      [CONSTANTS.SECTIONS.TODO]: 'todo',
      [CONSTANTS.SECTIONS.IN_PROGRESS]: 'inprogress',
      [CONSTANTS.SECTIONS.DONE]: 'done',
    };

    return tasks.map((task) => {
      const status = statusMap[task.section] || 'todo';

      return {
        id: task.id,
        content: task.title,
        priority: task.priority,
        tags: task.tags.map((tag) => tag.label),
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : undefined,
        comments: task.comments.length,
        attachments: task.attachments.length,
        assignees: task.assignees.map((assignee) => assignee.name),
        status,
        isCompleted: task.isCompleted,
      };
    });
  };
}
