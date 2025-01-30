const request = require('supertest');
const { app, server } = require('../../server');
const { Buffer } = require('buffer');
const { PrismaClient } = require('@prisma/client');
const { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');
const {verifyAccessToken} = require('../../utils/jwt');
const prisma = new PrismaClient();

describe('Download file by user Endpoint', () => {
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
    await prisma.user.deleteMany(); // Clear the users table
  });

  // After each test
  afterEach(async () => {
    await prisma.file.deleteMany();
    await prisma.user.deleteMany(); // Clear the users table
  });

  it('should fail, download with id not valid', async () => {
    const newUser = {
          email: "test@gmail.com",
          password: "K!ueiwuew988",
          username: "ets_893"
        };
    
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(newUser);

      const accessToken = response.body.data.accessToken;

    const fakeId = '343433'
    const responseDownloadFile = await request(app)
      .get(`/api/v1/files/download/${fakeId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(responseDownloadFile.status).toBe(404);
    expect(responseDownloadFile.body).toHaveProperty('message', 'File not found');

    
  });

  it('should fail, download with id is NaN', async () => {
    const newUser = {
          email: "test@gmail.com",
          password: "K!ueiwuew988",
          username: "ets_893"
        };
    
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(newUser);

      const accessToken = response.body.data.accessToken;

    const fakeId = 'fakeID'
    const responseDownloadFile = await request(app)
      .get(`/api/v1/files/download/${fakeId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(responseDownloadFile.status).toBe(400);
    expect(responseDownloadFile.body).toHaveProperty('message', 'File ID not valid');
    
  });

  it('should download one file', async () => {
    const newUser = {
          email: "test@gmail.com",
          password: "K!ueiwuew988",
          username: "ets_893"
        };
    
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send(newUser);

      const accessToken = response.body.data.accessToken;
      const data =  await verifyAccessToken(accessToken);

      let items = [
        {
          userId: data.payload.email, 
          filename: 'Leonardo da Vinci',
          originalName: 'file2.txt',
          size: 10000, 
          mimetype: 'text/plain', 
          data: Buffer.from('Content of file 1').toString('base64'),
          checksum: '2e71d7daf9b423f8df0a83ebef192421',
          compressed: true
        },
        {
          userId: data.payload.email, 
          filename: 'Roma',
          originalName: 'file2.txt',
          size: 50000, 
          mimetype: 'text/plain', 
          data: Buffer.from('Content of file 2').toString('base64'), // Convert to base64
          checksum: '20c1d191ec2f3d65faa2b1ed89f0f3b6',
          compressed: true
        },
      ];


    // Create test files
    await prisma.file.createMany({
      data: items
    });

    const responseFiles = await request(app)
      .get('/api/v1/files?page=1&limit=10')
      .set('Authorization', `Bearer ${accessToken}`)

    const sanitizedFilename = responseFiles.body.data.files[0].filename.replace(/\s+/g, '_');

    expect(responseFiles.status).toBe(200);

    const responseDownloadFile = await request(app)
      .get(`/api/v1/files/download/${responseFiles.body.data.files[0].id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(responseDownloadFile.status).toBe(200);
    expect(responseDownloadFile.headers['content-disposition']).toContain(`attachment; filename="${sanitizedFilename}.zip"`);
    
  });
});