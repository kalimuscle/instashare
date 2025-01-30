const request = require('supertest');
const { app, server } = require('../../server'); // Make sure to export your app from the main file
const { PrismaClient } = require('@prisma/client');
const { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');

const prisma = new PrismaClient();

describe('Signup Endpoint', () => {
  // Before all tests
  beforeAll(async () => {
    await prisma.$connect();
  });

  // After all tests
  afterAll(async () => {
    await prisma.$disconnect(); // Close the database connection
    server.close();
  });

  // Before each test
  beforeEach(async () => {
    await prisma.file.deleteMany();
    await prisma.user.deleteMany(); // Clean the user table
  });

  // After each test
  afterEach(async () => {
    await prisma.file.deleteMany();
    await prisma.user.deleteMany(); // Clean the user table
  });

  it('email not valid, fail', async () => {
    const notValidEmailUser = {
      email: 'testuserexample.com',
      password: '123!WERTyu',
      username: 'Test_user78',
    };

    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(notValidEmailUser);

    expect(response.status).toBe(400);
    expect(response.body.errors[0]).toHaveProperty('msg', 'Invalid email format');
   
  });

  it('username not valid, fail', async () => {
    const notValidUsername = {
      email: 'testuser@example.com',
      password: '123!WERTyu',
      username: '',
    };

    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(notValidUsername);

    expect(response.status).toBe(400);
    expect(response.body.errors[0]).toHaveProperty('msg', 'Username must be at least 6 characters long');
    expect(response.body.errors[1]).toHaveProperty('msg', 'Username is required');
  });

  it('password not valid, fail', async () => {
    const notValidPassword = {
      email: 'testuser@example.com',
      password: '',
      username: 'testuy_235',
    };

    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(notValidPassword);

    expect(response.status).toBe(400);
    expect(response.body.errors[0]).toHaveProperty('msg', 'Password must be at least 8 characters long');
    expect(response.body.errors[1]).toHaveProperty('msg', 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
  });


  it('should register a new user successfully', async () => {
    const newUser = {
      email: "test@gmail.com",
      password: "K!ueiwuew988",
      username: "ets_893"
    };

    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'User created successfully');
    expect(response.body.data).toHaveProperty('email', newUser.email);

    // Verify that the user was created in the database
    const createdUser = await prisma.user.findUnique({
      where: { email: newUser.email },
    });

    expect(createdUser).not.toBeNull();
    expect(createdUser.email).toBe(newUser.email);
  });

  it('should fail if user already registered', async () => {
    const duplicateUser = {
      email: "test@gmail.com",
      password: "K!ueiwuew988",
      username: "ets_893"
    };

    // Create a user initially
    await prisma.user.create({
      data: {
        email: duplicateUser.email,
        password: duplicateUser.password,
        name: duplicateUser.username
      },
    });

    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(duplicateUser);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('message', 'User already registered');
  });
});