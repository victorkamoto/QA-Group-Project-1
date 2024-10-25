export type Team = {
  xata_id: string;
  name: string;
  description: string;
  adminId: string;
};

export type CreateTeam = Omit<Team, "xata_id">;
export type UpdateTeam = Partial<Omit<CreateTeam, "xata_id">>;
