import request from 'supertest';
import app from '../server';
import { xata } from '../server';

describe('Task Controller', () => {
  let userId: string;
  let teamId: string;
  let projectId: string;
  let taskId: string;
  let authToken: string;

  beforeAll(async () => {
    // Create a test user and get auth token
    const userData = {
      name: 'Test User',
      email: 'testuser@example.com',
      password: 'password123',
    };
    const registerResponse = await request(app).post('/auth/register').send(userData);
    userId = registerResponse.body.details.id;

    const loginResponse = await request(app).post('/auth/login').send({
      email: 'testuser@example.com',
      password: 'password123',
    });
    authToken = loginResponse.body.token;

    // Create a test team
    const teamData = {
      name: 'Test Team',
      description: 'A team for testing',
      adminId: userId,
    };
    const teamResponse = await request(app)
      .post('/teams')
      .set('Authorization', `Bearer ${authToken}`)
      .send(teamData);
    teamId = teamResponse.body.details.xata_id;

    // Create a test project
    const projectData = {
      name: 'Test Project',
      teamId: teamId,
    };
    const projectResponse = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .send(projectData);
    projectId = projectResponse.body.details.xata_id;

    // Create a test task
    const taskData = {
      title: 'Test Task',
      description: 'A task for testing',
      status: 'todo',
      projectId: projectId,
      assigneeId: userId,
    };
    const taskResponse = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData);
    taskId = taskResponse.body.details.xata_id;
  });

  afterAll(async () => {
    // Clean up: Delete the test task, project, team, and user
    await xata.db.Task.delete(taskId);
    await xata.db.Project.delete(projectId);
    await xata.db.Team.delete(teamId);
    await xata.db.User.delete(userId);
  });

  describe('create', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: 'New Test Task',
        description: 'Another task for testing',
        status: 'todo',
        projectId: projectId,
        assigneeId: userId,
      };
      const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Task created successfully');
      expect(response.body.details).toHaveProperty('xata_id');

      // Clean up: Delete the newly created task
      await xata.db.Task.delete(response.body.details.xata_id);
    });
  });

  describe('getTasks', () => {
    it('should fetch all tasks', async () => {
      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      console.log(response.body);
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('getTaskById', () => {
    it('should fetch a task by id', async () => {
      const response = await request(app)
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task found!');
      expect(response.body.details.xata_id).toBe(taskId);
    });

    it('should return 404 if task not found', async () => {
      const nonExistentId = 'non_existent_id';
      const response = await request(app)
        .get(`/tasks/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found!');
    });
  });

  describe('update', () => {
    it('should update a task successfully', async () => {
      const updateData = {
        title: 'Updated Task Title',
        description: 'Updated task description',
      };
      const response = await request(app)
        .put(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task updated successfully');
      expect(response.body.details.title).toBe('Updated Task Title');
      expect(response.body.details.description).toBe('Updated task description');
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a task', async () => {
      const updateData = {
        status: 'in_progress',
      };
      const response = await request(app)
        .patch(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task status updated successfully');
      expect(response.body.details.status).toBe('in_progress');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      const response = await request(app)
        .delete(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');

      // Verify the task is deleted
      const checkDeleted = await request(app)
        .get(`/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(checkDeleted.status).toBe(404);
    });
  });
});