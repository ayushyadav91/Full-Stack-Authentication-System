import request from 'supertest';
import  mongoose from 'mongoose';
import app from '../index.js'; // Adjust the path to your app file

beforeAll(async () => {
    // Connect to the test database before running tests
    await mongoose.connect(process.env.MONGO_URI, { dbName: 'test_authentication' });
});

afterAll(async () => {
    // Close the database connection after tests
    await mongoose.connection.db.dropDatabase(); // Drop the test database
    await mongoose.connection.close();
});

describe('Auth Routes', () => {
  const testUser = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'Test@1234'
  };

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('newUser');
    expect(res.body.error).toBe(false);
  });

  it('should not register a user with existing email', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const res = await request(app)
    .post('/api/v1/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'User already exists');
  });

  it('should login a registered user', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const res = await request(app)
      .post('/api/v1/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('should not login with wrong password', async () => {
    await request(app).post('/api/v1/auth/register').send(testUser);
    const res = await request(app)
      .post('/api/v1/login')
      .send({ email: testUser.email, password: 'wrongpassword' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should get user info (mocked)', async () => {
    const res = await request(app).get('/api/v1/auth/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('email');
  });
});