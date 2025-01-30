const request = require('supertest');
const { app, server } = require('../../../server');
const { Buffer } = require('buffer');
const { PrismaClient } = require('@prisma/client');
const { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');
const {verifyAccessToken} = require('../../../utils/jwt');

const { processFiles } = require("../../../schedule/zip.schedule");

const prisma = new PrismaClient();

describe("processFiles", () => {
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

  it("should process and compress files", async () => {
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
        originalName: 'file1.txt',
        size: 10000, 
        mimetype: 'text/plain', 
        data: Buffer.from('Content of file 1').toString('base64'),
        checksum: '2e71d7daf9b423f8df0a83ebef192421',
        compressed: false
      },
      {
        userId: data.payload.email, 
        filename: 'file2.txt',
        originalName: 'file2.txt',
        size: 50000, 
        mimetype: 'text/plain', 
        data: Buffer.from('Content of file 2').toString('base64'), // Convert to base64
        checksum: '20c1d191ec2f3d65faa2b1ed89f0f3b6',
        compressed: false
        
      },
    ];


    // Create test files
    await prisma.file.createMany({
      data: items
    });

    await processFiles();

    const files =await prisma.file.findMany({
        where: { compressed: false }, // Select files with field compressed = false
      });

    expect(files.length).toBe(0);
  });

  // it("should handle errors during file processing", async () => {
  //   const mockFiles = [
  //     { id: 1, filename: "file1.txt", data: Buffer.from("file1 data"), compressed: false },
  //   ];

  //   prismaMock.file.findMany.mockResolvedValue(mockFiles);

  //   const archiveMock = {
  //     append: jest.fn(),
  //     finalize: jest.fn(),
  //     on: jest.fn((event, callback) => {
  //       if (event === "error") {
  //         callback(new Error("Compression error"));
  //       }
  //     }),
  //   };

  //   archiver.mockReturnValue(archiveMock);

  //   await processFiles();

  //   expect(prismaMock.file.findMany).toHaveBeenCalledWith({ where: { compressed: false } });
  //   expect(archiveMock.append).toHaveBeenCalledTimes(1);
  //   expect(archiveMock.finalize).toHaveBeenCalledTimes(1);
  //   expect(prismaMock.file.update).not.toHaveBeenCalled();
  // });
});