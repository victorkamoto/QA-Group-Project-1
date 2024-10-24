import { create } from "zustand";
import { User } from "../types";
import { Team } from "../types/team.types";
import { getTeams } from "../lib/teams";

interface StoreState {
  //   user: User;
  //   setUser: (user: User) => void;

  teams: Team[];
  getTeams: () => void;
}

export const store = create<StoreState>()((set) => ({
  teams: [],
  getTeams: async () => {
    const { data } = await getTeams();
    set({ teams: [...data] });
  },
}));
