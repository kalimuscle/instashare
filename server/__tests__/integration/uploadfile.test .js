const request = require('supertest');
const { app, server } = require('../../server'); // Make sure to export your app from the main file
const { PrismaClient } = require('@prisma/client');
const { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');
const path = require('path');

const prisma = new PrismaClient();

describe('Upload file by user Endpoint', () => {
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
    await prisma.user.deleteMany(); // Clean the users table
  });

  // After each test
  afterEach(async () => {
    await prisma.file.deleteMany();
    await prisma.user.deleteMany(); // Clean the users table
  });

  it('should fail, file name not valid', async () => {
    const newUser = {
      email: "test@gmail.com",
      password: "K!ueiwuew988",
      username: "ets_893"
    };

    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(newUser);

    const accessToken = response.body.data.accessToken;

    const filePath = path.join(path.resolve(path.dirname('')), 'testfile.txt');
    const fileContent = 'This is a test file content';
    require('fs').writeFileSync(filePath, fileContent);

    const responseUpload = await request(app)
      .post('/api/v1/files/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', filePath);

    expect(responseUpload.status).toBe(400);
    expect(responseUpload.body).toHaveProperty('message', 'File name is required');
  });

  it('should fail, file name length not valid', async () => {
    const newUser = {
      email: "test@gmail.com",
      password: "K!ueiwuew988",
      username: "ets_893"
    };

    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(newUser);

    const accessToken = response.body.data.accessToken;

    const filePath = path.join(path.resolve(path.dirname('')), 'testfile.txt');
    const fileContent = 'This is a test file content';
    require('fs').writeFileSync(filePath, fileContent);

    const characters = new Array(121).fill('A').join('');

    const responseUpload = await request(app)
      .post('/api/v1/files/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', characters )
      .attach('file', filePath);

    expect(responseUpload.status).toBe(400);
    expect(responseUpload.body).toHaveProperty('message', 'File name must be lower than 120 characters.');

  });

  it('should fail to upload a file null', async () => {
    const newUser = {
      email: "test@gmail.com",
      password: "K!ueiwuew988",
      username: "ets_893"
    };

    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(newUser);

    const accessToken = response.body.data.accessToken;

    const responseUpload = await request(app)
      .post('/api/v1/files/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', 'File name 1' )
      // .attach('file', null);

    expect(responseUpload.status).toBe(400);
    expect(responseUpload.body).toHaveProperty('message', 'No file uploaded');
  });

  it('should upload a file successfully', async () => {
    const newUser = {
      email: "test@gmail.com",
      password: "K!ueiwuew988",
      username: "ets_893"
    };

    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(newUser);

    const accessToken = response.body.data.accessToken;

    const filePath = path.join(path.resolve(path.dirname('')), 'testfile.txt');
    const fileContent = 'This is a test file content';
    require('fs').writeFileSync(filePath, fileContent);


    const responseUpload = await request(app)
      .post('/api/v1/files/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', 'File name 1')
      .attach('file', filePath);

    expect(responseUpload.status).toBe(201);
    expect(responseUpload.body.data).toHaveProperty('filename', 'File name 1');
  });

  it('should fail, upload a file repeated', async () => {
    const newUser = {
      email: "test@gmail.com",
      password: "K!ueiwuew988",
      username: "ets_893"
    };

    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(newUser);

    const accessToken = response.body.data.accessToken;

    const filePath = path.join(path.resolve(path.dirname('')), 'testfile.txt');
    const fileContent = 'This is a test file content';
    require('fs').writeFileSync(filePath, fileContent);


    await request(app)
      .post('/api/v1/files/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', 'File name 1')
      .attach('file', filePath);

    const responseUpload2 = await request(app)
      .post('/api/v1/files/upload')
      .set('Authorization', `Bearer ${accessToken}`)
      .field('name', 'File name 1')
      .attach('file', filePath);

    expect(responseUpload2.status).toBe(409);
    expect(responseUpload2.body.message).toContain('File already uploaded with checksum');
  });
});