const request = require('supertest');
const { app, server } = require('../../server');
const { Buffer } = require('buffer');
const { PrismaClient } = require('@prisma/client');
const { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');
const {verifyAccessToken} = require('../../utils/jwt');
const prisma = new PrismaClient();

describe('Get all files by user Endpoint', () => {
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

  it('should return all files', async () => {
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
          filename: 'file1.txt',
          originalName: 'file2.txt',
          size: 10000, 
          mimetype: 'text/plain', 
          data: Buffer.from('Content of file 1').toString('base64'),
          checksum: '2e71d7daf9b423f8df0a83ebef192421'
        },
        {
          userId: data.payload.email, 
          filename: 'file2.txt',
          originalName: 'file2.txt',
          size: 50000, 
          mimetype: 'text/plain', 
          data: Buffer.from('Content of file 2').toString('base64'), // Convert to base64
          checksum: '20c1d191ec2f3d65faa2b1ed89f0f3b6',
          
        },
      ];


    // Create test files
    await prisma.file.createMany({
      data: items
    });

    const responseFiles = await request(app)
      .get('/api/v1/files?page=1&limit=10')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(responseFiles.status).toBe(200);
    // because compressed field is false
    expect(responseFiles.body.data.files.length).toBe(0); 
    
    await prisma.file.updateMany({
      where: { userId: data.payload.email },
      data: { compressed: true }
    });

    const responseFiles2 = await request(app)
      .get('/api/v1/files?page=1&limit=10')
      .set('Authorization', `Bearer ${accessToken}`)

      expect(responseFiles2.status).toBe(200);
      expect(responseFiles2.body.data.files.length).toBe(2); 
      expect(responseFiles2.body.data.files[0]).toHaveProperty('filename', 'file1.txt');
      expect(responseFiles2.body.data.files[1]).toHaveProperty('filename', 'file2.txt');
  });
});