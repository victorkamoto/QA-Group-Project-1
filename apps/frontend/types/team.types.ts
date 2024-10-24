export type Team = {
  xata_id: string;
  name: string;
  description: string;
  adminId: string;
};

export type CreateTeam = Omit<Team, "id">;
export type UpdateTeam = Partial<CreateTeam>;
