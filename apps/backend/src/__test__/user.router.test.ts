import request from 'supertest';
import app from '../../src/server';
import userRouter from '../../src/routers/user.router';

describe('User Routes', () => {
  it('should return a list of users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
    };
    const response = await request(app).post('/users/register').send({
      userData
    });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      'message',
      'User created successfully!'
    );
  });

  it('should return an error for duplicate email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
    };
    await request(app).post('/users/register').send(userData);
    const response = await request(app).post('/users/register').send(userData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'User already exists!');
  });

  it('should login a user', async () => {
    const userData = {
      email: 'john.doe@example.com',
      password: 'securePassword123',
    };
    const response = await request(app).post('/users/login').send(userData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should return an error for invalid login credentials', async () => {
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
