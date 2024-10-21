import request from 'supertest';
import app from '../../src/server';
import { create, login } from '../../src/controllers/auth.controller';

describe('Auth Controller', () => {
  it('should create a new user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
    };
    const response = await request(app).post('/users/register').send(userData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      'message',
      'User created successfully'
    );
  });

  it('should handle invalid request data and return error message', async () => {
    const userData = {
      name: 'John Doe',
      email: 'invalid@example.com',
    };
    const response = await request(app).post('/users/register').send(userData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  it('should login a user successfully', async () => {
    const userData = {
      email: 'john.doe@example.com',
      password: 'securePassword123',
    };
    const response = await request(app).post('/users/login').send(userData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should handle invalid login credentials and return error message', async () => {
    const userData = {
      email: 'invalid@example.com',
      password: 'wrongPassword',
    };
    const response = await request(app).post('/users/login').send(userData);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      'message',
      'Invalid login credentials'
    );
  });
});
