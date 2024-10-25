import { create } from "zustand";
import { ApiRes, User } from "../types";
import { CreateTeam, Team, UpdateTeam } from "../types/team.types";
import {
  createTeam,
  deleteTeam,
  getTeams,
  joinTeam,
  updateTeam,
} from "../lib/teams";
import { CreateProject, Project, UpdateProject } from "../types/project.types";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../lib/projects";

interface StoreState {
  //   user: User;
  //   setUser: (user: User) => void;

  teams: Team[];
  getTeams: () => Promise<void>;
  joinTeam: (teamId: string, userId: string) => Promise<ApiRes>;
  createTeam: (team: CreateTeam) => Promise<ApiRes>;
  updateTeam: (id: string, team: UpdateTeam) => Promise<ApiRes>;
  deleteTeam: (id: string) => Promise<ApiRes>;

  projects: Project[];
  getProjects: () => Promise<void>;
  createProject: (project: CreateProject) => Promise<ApiRes>;
  updateProject: (id: string, team: UpdateProject) => Promise<ApiRes>;
  deleteProject: (id: string) => Promise<ApiRes>;
}

export const store = create<StoreState>()((set) => ({
  teams: [],
  getTeams: async () => {
    const { data } = await getTeams();
    set({ teams: [...data] });
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

  projects: [],
  getProjects: async () => {
    const { data } = await getProjects();
    set({ projects: [...data] });
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
}));
