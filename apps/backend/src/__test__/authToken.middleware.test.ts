import request from 'supertest';
import app from '../../src/server';
import { authenticateTokenMiddleware } from '../../src/middleware/authToken.middleware';
import jwt from 'jsonwebtoken';

describe('Auth Token Middleware', () => {
  it('should return 400 if token is missing', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Unauthorized request');
  });

  it('should return 403 if token is invalid', async () => {
    const token = 'invalid-token';
    const response = await request(app).get('/users').set("Cookie", `token-Cookie=${token}`);
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('message', 'Invalid or expired token');
  });

  it('should call next() if token is valid', async () => {
    const token = 'valid-token';
    const verifySpy = jest.spyOn(jwt, 'verify');
    verifySpy.mockReturnValueOnce({} as any);
    const response = await request(app).get('/users').set("Cookie", `token-Cookie=${token}`);
    expect(response.status).toBe(200);
    expect(verifySpy).toHaveBeenCalledTimes(1);
  });

  it('should return 500 if access token secret is missing', async () => {
    const token = 'valid-token';
    process.env.JWT_SECRET = '';
    const response = await request(app).get('/users').set("Cookie", `token-Cookie=${token}`);
    expect(response.status).toBe(500);
  });
});