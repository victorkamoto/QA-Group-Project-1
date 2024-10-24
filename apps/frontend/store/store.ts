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

interface StoreState {
  //   user: User;
  //   setUser: (user: User) => void;

  teams: Team[];
  getTeams: () => Promise<void>;
  joinTeam: (teamId: string, userId: string) => Promise<ApiRes>;
  createTeam: (team: CreateTeam) => Promise<ApiRes>;
  updateTeam: (id: string, team: UpdateTeam) => Promise<ApiRes>;
  deleteTeam: (id: string) => Promise<ApiRes>;
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
}));
