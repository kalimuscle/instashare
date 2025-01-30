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
    };

    const response = await request(app)
      .post('/api/v1/auth/signin')
      .send(notValidEmailUser);

    expect(response.status).toBe(400);
    expect(response.body.errors[0]).toHaveProperty('msg', 'Invalid email format');
   
  });

  it('password not valid, fail', async () => {
    const notValidPassword = {
      email: 'testuser@example.com',
      password: '',
    };

    const response = await request(app)
      .post('/api/v1/auth/signin')
      .send(notValidPassword);

    expect(response.status).toBe(400);
    expect(response.body.errors[0]).toHaveProperty('msg', 'Password must be at least 8 characters long');
    expect(response.body.errors[1]).toHaveProperty('msg', 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
  });


  it('should login a user successfully', async () => {
    const newUser = {
      email: "test@gmail.com",
      password: "K!ueiwuew988",
      username: "testUser",
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

    const responseLogin = await request(app)
      .post('/api/v1/auth/signin')
      .send({ email: newUser.email, password: newUser.password });

    expect(responseLogin.status).toBe(200);
    expect(responseLogin.body).toHaveProperty('message', 'User logged in successfully');
    expect(responseLogin.body.data).toHaveProperty('email', newUser.email);
  });
});