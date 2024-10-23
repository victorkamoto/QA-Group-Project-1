export type Team = {
  id: string;
  name: string;
  description: string;
  adminId: string;
};

export type CreateTeam = Omit<Team, "id">;
export type UpdateTeam = Partial<CreateTeam>;
