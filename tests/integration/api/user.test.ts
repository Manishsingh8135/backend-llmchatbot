// File: tests/integration/api/user.test.ts

import request from 'supertest';
import app  from '../../../src/app';
import User from '../../../src/infrastructure/database/models/userModel';
import { generateToken } from '../../../src/utils/jwtUtils';

describe('User API', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    userId = user._id.toString();
    token = generateToken(user._id);
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Test User');
      expect(res.body).toHaveProperty('email', 'test@example.com');
    });

    it('should not get profile without token', async () => {
      const res = await request(app)
        .get('/api/users/profile');
      
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Not authorized to access this route');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Updated User',
          email: 'updated@example.com'
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', 'Updated User');
      expect(res.body).toHaveProperty('email', 'updated@example.com');
    });
  });
});