import request from 'supertest';
import app, { xata } from '../server';
import {
  create,
  getProjects,
  getProjectById,
  update,
  deleteProject,
} from '../controllers/project.controller';

describe('Project Controller', () => {
  let projectId: string;
  let teamId: string;
  let userId: string;

  beforeAll(async () => {
    // Create a test user
    const userResponse = await request(app).post('/auth/register').send({
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    });
    userId = userResponse.body.details.xata_id;

    // Create a test team
    const teamResponse = await request(app).post('/teams').send({
      name: 'Test Team',
      description: 'A team for testing',
      adminId: userId,
    });
    teamId = teamResponse.body.details.xata_id;

    // Create a test project
    const projectResponse = await request(app).post('/projects').send({
      name: 'Test Project',
      teamId: teamId,
    });
    projectId = projectResponse.body.details.xata_id;
  });

  afterAll(async () => {
    // Clean up: Delete the test project, team, and user
    await xata.db.Project.delete(projectId);
    await xata.db.Team.delete(teamId);
    await xata.db.User.delete(userId);
  });

  describe('create', () => {
    it('should create a new project successfully', async () => {
      const projectData = {
        name: 'New Test Project',
        teamId: teamId,
      };
      const response = await request(app).post('/projects').send(projectData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Project created successfully');
      expect(response.body.details).toHaveProperty('xata_id');

      // Clean up: Delete the newly created project
      if (response.body.details && response.body.details.xata_id) {
        await xata.db.Project.delete(response.body.details.xata_id);
      }
    });

    it('should return error if project name is missing', async () => {
      const projectData = {
        teamId: teamId,
      };
      const response = await request(app).post('/projects').send(projectData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('getProjects', () => {
    it('should fetch all projects', async () => {
      const response = await request(app).get('/projects');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('getProjectById', () => {
    it('should fetch a project by id', async () => {
      const response = await request(app).get(`/projects/${projectId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Project found!');
      expect(response.body.details.xata_id).toBe(projectId);
    });

    it('should return 404 if project not found', async () => {
      const nonExistentId = 'non_existent_id';
      const response = await request(app).get(`/projects/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Project not found!');
    });
  });

  describe('update', () => {
    it('should update a project successfully', async () => {
      const updateData = {
        name: 'Updated Project Name',
      };
      const response = await request(app)
        .put(`/projects/${projectId}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Project updated successfully');
      expect(response.body.details.name).toBe('Updated Project Name');
    });
  });

  describe('deleteProject', () => {
    it('should delete a project successfully', async () => {
      // Create a project to delete
      const projectToDelete = await request(app).post('/projects').send({
        name: 'Project to Delete',
        teamId: teamId,
      });
      const projectToDeleteId = projectToDelete.body.details.xata_id;

      const response = await request(app).delete(
        `/projects/${projectToDeleteId}`
      );

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Project deleted successfully');

      // Verify the project is deleted
      const checkDeleted = await request(app).get(
        `/projects/${projectToDeleteId}`
      );
      expect(checkDeleted.status).toBe(404);
    });

    it('should return 404 if project to delete is not found', async () => {
      const nonExistentId = 'non_existent_id';
      const response = await request(app).delete(`/projects/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Project not found');
    });
  });
});
