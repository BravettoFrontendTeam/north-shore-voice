// Minimal auth E2E test
process.env.JWT_SECRET = process.env.JWT_SECRET || 'dev-test-secret-which-is-very-long-1234567890';

import request from 'supertest';
import { app } from '../src/index';

describe('Auth E2E', () => {
  test('POST /api/auth/login sets JSESSIONID and /api/auth/me returns user', async () => {
    // Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test', password: 'test' })
      .expect(200);

    expect(loginRes.headers['set-cookie']).toBeDefined();
    const cookieHeader = loginRes.headers['set-cookie'];
    // Normalize cookie header to a single string
    const cookieValue = Array.isArray(cookieHeader) ? cookieHeader.join('; ') : String(cookieHeader);
    // Use cookie for /me
    const meRes = await request(app).get('/api/auth/me').set('Cookie', cookieValue).expect(200);

    expect(meRes.body).toHaveProperty('email', 'test');
    expect(meRes.body).toHaveProperty('name');
  });
});
