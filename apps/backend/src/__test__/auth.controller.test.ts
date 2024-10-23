import request from 'supertest';
import app, { xata } from '../../src/server';
import { register, login } from '../../src/controllers/auth.controller';

describe('Auth Controller', () => {
  it('should create a new user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john.doe@examplwwt.com',
      password: 'securePassword123',
    };
    const response = await request(app).post('/auth/register').send(userData);
    console.log(response);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      'message',
      'User created successfully!'
    );
  });

  describe('Validate user registration data', () => {
    describe('User registration', () => {
      it('should return error if name is empty', async () => {
        const userData = {
          name: '',
          email: 'jane.doe@example.com',
          password: 'password',
        };
        const response = await request(app)
          .post('/auth/register')
          .send(userData);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });

      it('should return error if email is empty', async () => {
        const userData = {
          name: 'Jane Doe',
          email: '',
          password: 'password',
        };
        const response = await request(app)
          .post('/auth/register')
          .send(userData);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });
      it('should return error if password length is not between 8-72 characters', async () => {
        const userData = {
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          password: 'pass',
        };
        const response = await request(app)
          .post('/auth/register')
          .send(userData);
        // console.log(response);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
      });
    });
  });
  it('should handle invalid request data and return error message', async () => {
    const userData = {
      name: 'John Doe',
      email: 'invalid@example.com',
    };
    const response = await request(app).post('/auth/register').send(userData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('errors');
  });

  it('should login a user successfully', async () => {
    const userData = {
      email: 'john.doe@examplwwt.com',
      password: 'securePassword123',
    };
    const response = await request(app).post('/auth/login').send(userData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('should handle invalid login credentials and return error message', async () => {
    const userData = {
      email: 'invalid@example.com',
      password: 'wrongPassword',
    };
    const response = await request(app).post('/auth/login').send(userData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Invalid credentials!');
  });
});
