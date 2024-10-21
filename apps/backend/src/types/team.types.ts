export type Team = {
    name: string;
    description: string;
    adminId: string;
}

export type JoinTeamData = {
    teamId: string;
    userId: string;
    role: 'admin' | 'member';
}

export type JoinTeam = Omit<JoinTeamData, 'role'>;

export type CreateTeam = Team;
export type UpdateTeam = Partial<Team>;
export type DeleteTeam = Pick<Team, 'adminId'>;
export type RemoveMember = Omit<JoinTeamData, 'role'>
