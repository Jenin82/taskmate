import { create } from "zustand";
import {
  Task,
  TaskCategory,
  Location,
  TaskDetails,
  Pricing,
  Tasker,
  TaskStatus,
  TimelineEvent,
} from "@/types";
import { generateId } from "@/lib/utils";

interface TaskState {
  currentTask: Task | null;
  isLoading: boolean;

  // Actions
  createTask: (description: string, category: TaskCategory) => void;
  updateLocations: (locations: Location[]) => void;
  updateDetails: (details: TaskDetails) => void;
  updatePricing: (pricing: Pricing) => void;
  assignTasker: (tasker: Tasker) => void;
  updateStatus: (status: TaskStatus) => void;
  updateTaskerLocation: (location: { lat: number; lng: number }) => void;
  updateTimeline: (timeline: TimelineEvent[]) => void;
  setLoading: (loading: boolean) => void;
  resetTask: () => void;
}

const initialTimeline: TimelineEvent[] = [
  {
    id: "1",
    status: "REQUESTED",
    title: "Task Requested",
    timestamp: null,
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: "2",
    status: "ASSIGNED",
    title: "TaskMaster Assigned",
    timestamp: null,
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: "3",
    status: "EN_ROUTE",
    title: "TaskMaster En Route",
    timestamp: null,
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: "4",
    status: "ARRIVED",
    title: "TaskMaster Arrived",
    timestamp: null,
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: "5",
    status: "IN_PROGRESS",
    title: "Task In Progress",
    timestamp: null,
    isCompleted: false,
    isCurrent: false,
  },
  {
    id: "6",
    status: "COMPLETED",
    title: "Task Completed",
    timestamp: null,
    isCompleted: false,
    isCurrent: false,
  },
];

export const useTaskStore = create<TaskState>((set, get) => ({
  currentTask: null,
  isLoading: false,

  createTask: (description: string, category: TaskCategory) => {
    const task: Task = {
      id: generateId(),
      description,
      category,
      locations: [],
      details: null,
      pricing: null,
      tasker: null,
      status: "DRAFT",
      createdAt: new Date(),
      timeline: [...initialTimeline],
    };
    set({ currentTask: task });
  },

  updateLocations: (locations: Location[]) => {
    const { currentTask } = get();
    if (currentTask) {
      set({ currentTask: { ...currentTask, locations } });
    }
  },

  updateDetails: (details: TaskDetails) => {
    const { currentTask } = get();
    if (currentTask) {
      set({ currentTask: { ...currentTask, details } });
    }
  },

  updatePricing: (pricing: Pricing) => {
    const { currentTask } = get();
    if (currentTask) {
      set({ currentTask: { ...currentTask, pricing } });
    }
  },

  assignTasker: (tasker: Tasker) => {
    const { currentTask } = get();
    if (currentTask) {
      set({ currentTask: { ...currentTask, tasker, status: "ASSIGNED" } });
    }
  },

  updateStatus: (status: TaskStatus) => {
    const { currentTask } = get();
    if (currentTask) {
      const timeline = currentTask.timeline.map((event) => {
        const statusOrder: TaskStatus[] = [
          "REQUESTED",
          "ASSIGNED",
          "EN_ROUTE",
          "ARRIVED",
          "IN_PROGRESS",
          "COMPLETED",
        ];
        const currentIndex = statusOrder.indexOf(status);
        const eventIndex = statusOrder.indexOf(event.status);

        return {
          ...event,
          isCompleted: eventIndex < currentIndex,
          isCurrent: event.status === status,
          timestamp:
            eventIndex <= currentIndex && !event.timestamp
              ? new Date()
              : event.timestamp,
        };
      });

      set({ currentTask: { ...currentTask, status, timeline } });
    }
  },

  updateTaskerLocation: (location: { lat: number; lng: number }) => {
    const { currentTask } = get();
    if (currentTask && currentTask.tasker) {
      set({
        currentTask: {
          ...currentTask,
          tasker: { ...currentTask.tasker, currentLocation: location },
        },
      });
    }
  },

  updateTimeline: (timeline: TimelineEvent[]) => {
    const { currentTask } = get();
    if (currentTask) {
      set({ currentTask: { ...currentTask, timeline } });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  resetTask: () => {
    set({ currentTask: null, isLoading: false });
  },
}));
