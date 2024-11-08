import { create } from "zustand";
import { ApiRes, User } from "../types";
import { CreateTeam, Team, UpdateTeam } from "../types/team.types";
import {
  createTeam,
  deleteTeam,
  getMembersByTeamId,
  getTeams,
  getTeamsByUserId,
  joinTeam,
  updateTeam,
} from "../lib/teams";
import { CreateProject, Project, UpdateProject } from "../types/project.types";
import {
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  getProjectsByTeamId,
  updateProject,
} from "../lib/projects";
import { Column, CreateTask, Task, UpdateTask } from "../types/task.types";
import {
  createTask,
  deleteTask,
  getTasks,
  getTasksByProjectId,
  updateTask,
} from "../lib/tasks";
import { getUser } from "../lib/auth";
import { devtools } from "zustand/middleware";

interface StoreState {
  //   user: User;
  //   setUser: (user: User) => void;
  getUser: (id: string) => Promise<ApiRes>;

  teams: Team[];
  getTeams: () => Promise<void>;
  getTeamsByUserId: (id: string) => Promise<ApiRes>;
  joinTeam: (teamId: string, userId: string) => Promise<ApiRes>;
  createTeam: (team: CreateTeam) => Promise<ApiRes>;
  updateTeam: (id: string, team: UpdateTeam) => Promise<ApiRes>;
  deleteTeam: (id: string) => Promise<ApiRes>;
  getMembersByTeamId: (id: string) => Promise<ApiRes>;

  projects: Project[];
  getProjects: () => Promise<void>;
  getProjectsByTeamId: (id: string) => Promise<ApiRes>;
  getProject: (id: string) => Promise<ApiRes>;
  createProject: (project: CreateProject) => Promise<ApiRes>;
  updateProject: (id: string, team: UpdateProject) => Promise<ApiRes>;
  deleteProject: (id: string) => Promise<ApiRes>;

  tasks: Task[];
  getTasks: () => Promise<void>;
  getTasksByProjectId: (id: string) => Promise<ApiRes>;
  createTask: (task: CreateTask) => Promise<ApiRes>;
  updateTask: (id: string, task: UpdateTask) => Promise<ApiRes>;
  deleteTask: (id: string) => Promise<ApiRes>;

  kanban: Column[];
  setKanban: (columns: Column[]) => void;
}

export const store = create<StoreState>()(
  devtools((set) => ({
    getUser: async (id) => {
      const { status, data } = await getUser(id);
      return { status, data };
    },

    teams: [],
    getTeams: async () => {
      const { data } = await getTeams();
      set({ teams: [...data] });
    },
    getTeamsByUserId: async (id) => {
      const { data, status } = await getTeamsByUserId(id);
      set({ teams: data });
      return { data, status };
    },
    joinTeam: async (teamId, userId) => {
      const { status, data } = await joinTeam(teamId, userId);
      set((state) => {
        const teams = state.teams.filter((t) => t.xata_id != teamId);
        return { teams: [...teams, data] };
      });
      return { status };
    },
    createTeam: async (team) => {
      const { status, data } = await createTeam(team);
      set((state) => {
        return { teams: [...state.teams, data] };
      });
      return { status };
    },
    updateTeam: async (id, team) => {
      const { status, data } = await updateTeam(id, team);
      set((state) => {
        const teams = state.teams.filter((t) => t.xata_id != id);
        return { teams: [...teams, data] };
      });
      return { status };
    },
    deleteTeam: async (id) => {
      const { status } = await deleteTeam(id);
      set((state) => {
        const teams = state.teams.filter((t) => t.xata_id != id);
        return { teams: [...teams] };
      });
      return { status };
    },
    getMembersByTeamId: async (id) => {
      // TODO: deduplication
      const { status, data } = await getMembersByTeamId(id);
      return { status, data };
    },

    projects: [],
    getProjects: async () => {
      const { data } = await getProjects();
      set({ projects: [...data] });
    },
    getProjectsByTeamId: async (id) => {
      const { data, status } = await getProjectsByTeamId(id);
      return { data, status };
    },
    getProject: async (id) => {
      const { status, data } = await getProjectById(id);
      return { status, data };
    },
    createProject: async (project) => {
      const { status, data } = await createProject(project);
      set((state) => {
        return { projects: [...state.projects, data] };
      });
      return { status };
    },
    updateProject: async (id, project) => {
      const { status, data } = await updateProject(id, project);
      set((state) => {
        const projects = state.projects.filter((p) => p.xata_id != id);
        return { projects: [...projects, data] };
      });
      return { status };
    },
    deleteProject: async (id) => {
      const { status } = await deleteProject(id);
      set((state) => {
        const projects = state.projects.filter((p) => p.xata_id != id);
        return { projects: [...projects] };
      });
      return { status };
    },

    kanban: [
      {
        id: "backlog",
        title: "Backlog",
        tasks: [],
      },
      {
        id: "in-progress",
        title: "In Progress",
        tasks: [],
      },
      {
        id: "review",
        title: "Review",
        tasks: [],
      },
      {
        id: "completed",
        title: "Completed",
        tasks: [],
      },
    ],
    setKanban: (columns) => set({ kanban: columns }),

    tasks: [],
    getTasks: async () => {
      const { data } = await getTasks();
      set({ tasks: [...data] });
    },
    getTasksByProjectId: async (id) => {
      const { data, status } = await getTasksByProjectId(id);
      return { data, status };
    },
    createTask: async (task) => {
      let entry = { ...task, projectId: task.projectId?.xata_id };
      const { status, data } = await createTask(entry);

      set((state) => {
        return { tasks: [...state.tasks, data] };
      });

      return { status };
    },
    updateTask: async (id, task) => {
      let backup: Task[] = [];
      // optimistic for "snappy" ui
      set((state) => {
        backup = state.tasks;
        const tasks = state.tasks.filter((t) => t.xata_id != id);
        let target = state.tasks.find((t) => t.xata_id === id);
        target = { ...(target as Task), ...task };
        return { tasks: [...tasks, target] };
      });

      const { status, data } = await updateTask(id, task);

      if (status === 200) {
        set((state) => {
          const tasks = state.tasks.filter((t) => t.xata_id != id);
          return { tasks: [...tasks, data] };
        });
      } else {
        set({ tasks: backup });
      }

      return { status };
    },
    deleteTask: async (id) => {
      const { status } = await deleteTask(id);
      set((state) => {
        const tasks = state.tasks.filter((t) => t.xata_id != id);
        return { tasks: [...tasks] };
      });
      return { status };
    },
  }))
);
