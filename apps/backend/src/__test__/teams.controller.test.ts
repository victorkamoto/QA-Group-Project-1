import request from 'supertest';
import app, { xata } from '../../src/server';
import {
  create,
  getTeams,
  getTeamById,
  update,
  addMember,
  removeMember,
} from '../../src/controllers/team.controller';

describe('Team Controller', () => {
  let teamId: string;
  let userId: string;

  beforeAll(async () => {
    // Create a test user
    const userResponse = await request(app).post('/auth/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });
    console.log(userResponse);
    userId = userResponse.body.details.xata_id;

    // Create a test team
    const teamResponse = await request(app).post('/teams').send({
      name: 'Test Team',
      description: 'A team for testing',
      adminId: userId,
    });
    teamId = teamResponse.body.details.xata_id;
  });

  afterAll(async () => {
    // Clean up: Delete the test team and user
    await xata.db.Team.delete(teamId);
    await xata.db.User.delete(userId);
  });

  describe('create', () => {
    it('should create a new team successfully', async () => {
      const teamData = {
        name: 'New Test Team',
        description: 'Another team for testing',
        adminId: userId,
      };
      const response = await request(app).post('/teams').send(teamData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe(
        'New Test Team team created successfully!'
      );
      expect(response.body.details).toHaveProperty('xata_id');

      // Clean up: Delete the newly created team
      await xata.db.Team.delete(response.body.details.xata_id);
    });

    it('should return error if team name already exists', async () => {
      const teamData = {
        name: 'Test Team',
        description: 'A team for testing',
        adminId: userId,
      };
      const response = await request(app).post('/teams').send(teamData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Team Test Team already exists');
    });
  });

  describe('getTeams', () => {
    it('should fetch all teams', async () => {
      const response = await request(app).get('/teams');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('getTeamById', () => {
    it('should fetch a team by id', async () => {
      const response = await request(app).get(`/teams/${teamId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Team found!');
      expect(response.body.details.xata_id).toBe(teamId);
    });

    it('should return 404 if team not found', async () => {
      const nonExistentId = 'non_existent_id';
      const response = await request(app).get(`/teams/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Team not found!');
    });
  });

  describe('update', () => {
    it('should update a team successfully', async () => {
      const updateData = {
        description: 'Updated team description',
      };
      const response = await request(app)
        .put(`/teams/${teamId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Team updated successfully');
      expect(response.body.details.description).toBe(
        'Updated team description'
      );
    });
  });

  describe('addMember', () => {
    it('should add a member to a team', async () => {
      const memberData = {
        userId: userId,
        teamId: teamId,
      };
      const response = await request(app).post('/teams/add').send(memberData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User joined to team successfully!');
    });

    it('should return error if user is already a team member', async () => {
      const memberData = {
        userId: userId,
        teamId: teamId,
      };
      const response = await request(app).post('/teams/add').send(memberData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Error adding member');
      expect(response.body.details).toBe('User is already a team member');
    });
  });

  describe('removeMember', () => {
    it('should remove a member from a team', async () => {
      const memberData = {
        userId: userId,
        teamId: teamId,
      };
      const response = await request(app)
        .post('/teams/remove')
        .send(memberData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Removed team member!');
    });

    it('should return error if team member record not found', async () => {
      const memberData = {
        userId: 'non_existent_user_id',
        teamId: teamId,
      };
      const response = await request(app)
        .post('/teams/remove')
        .send(memberData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Error removing user!');
      expect(response.body.details).toBe('Team member record not found!');
    });
  });
});
