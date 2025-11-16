// Authentication tests
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../server.js';
import prisma from '../config/database.js';

describe('Authentication API', () => {
  let testUser = {
    email: 'test@example.com',
    password: 'testpassword123',
    name: 'Test User',
  };

  // Cleanup before and after tests
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: testUser.email },
    });
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.name).toBe(testUser.name);
      expect(response.body.user.isAdmin).toBe(false);

      // Check that HttpOnly cookie was set
      expect(response.headers['set-cookie']).toBeDefined();
      const cookies = response.headers['set-cookie'];
      expect(cookies.some(cookie => cookie.startsWith('token='))).toBe(true);
    });

    it('should reject registration with existing email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('geregistreerd');
    });

    it('should reject registration with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          password: '123',
          name: 'Test',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('minimaal 8');
    });

    it('should reject registration with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test3@example.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);

      // Check HttpOnly cookie
      expect(response.headers['set-cookie']).toBeDefined();
      const cookies = response.headers['set-cookie'];
      expect(cookies.some(cookie => cookie.startsWith('token='))).toBe(true);
      expect(cookies.some(cookie => cookie.includes('HttpOnly'))).toBe(true);
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Ongeldige');
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/auth/me', () => {
    let authCookie;

    beforeAll(async () => {
      // Login to get cookie
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      authCookie = response.headers['set-cookie'];
    });

    it('should return user profile when authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', authCookie)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.name).toBe(testUser.name);
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/logout', () => {
    let authCookie;

    beforeAll(async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      authCookie = response.headers['set-cookie'];
    });

    it('should logout and clear cookie', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', authCookie)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('uitgelogd');

      // Check that cookie was cleared
      expect(response.headers['set-cookie']).toBeDefined();
      const cookies = response.headers['set-cookie'];
      expect(cookies.some(cookie => cookie.includes('token=;'))).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should rate limit login attempts', async () => {
      const requests = [];

      // Make 6 login attempts (limit is 5)
      for (let i = 0; i < 6; i++) {
        requests.push(
          request(app)
            .post('/api/auth/login')
            .send({
              email: 'test@example.com',
              password: 'wrongpassword',
            })
        );
      }

      const responses = await Promise.all(requests);

      // Last request should be rate limited
      const lastResponse = responses[responses.length - 1];
      expect(lastResponse.status).toBe(429);
      expect(lastResponse.body.error).toContain('Te veel');
    }, 10000); // Increase timeout for this test
  });
});
