import { Team } from "./team.types";

export type Project = {
  xata_id: string;
  name: string;
  teamId: Team;
};

export type CreateProject = Omit<Project, "xata_id">;
export type UpdateProject = Partial<Pick<Project, "name" | "teamId">>;
