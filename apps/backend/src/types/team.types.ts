export type Team = {
    name: string;
    description: string;
    adminId: string;
}

export type CreateTeam = Team;
export type DeleteTeam = Pick<Team, 'adminId'>;
