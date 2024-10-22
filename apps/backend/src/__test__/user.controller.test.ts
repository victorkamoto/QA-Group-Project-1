import request from 'supertest';
import app from '../../src/server';
import { getUsers } from '../../src/controllers/user.controller';
import * as userServices from '../../src/services/user.services';

jest.mock('../../src/services/user.services');

describe('User Controller', () => {
  it('should fetch users successfully', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should handle errors and return error message', async () => {
    (userServices.fetchUsers as jest.Mock).mockRejectedValue(
      new Error('Database connection failed')
    );
    const response = await request(app).get('/users');
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Database connection failed');
  });
});
