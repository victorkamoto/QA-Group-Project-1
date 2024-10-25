export type Project = {
  xata_id: string;
  name: string;
  teamId: string;
};

export type NewProject = Omit<Project, "xata_id">;
export type UpdateProject = Partial<Pick<Project, "name" | "teamId">>;
