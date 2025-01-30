const { PrismaClient } = require('@prisma/client');
const { Buffer } = require('buffer');
const jwt = require('../../../utils/jwt');
const AuthService = require('../../../services/auth.service');
const FileService = require('../../../services/file.service');
const { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');

const prisma = new PrismaClient();

describe('FileService', () => {
    // Before all tests
    beforeAll(async () => {
        await prisma.$connect();
    });

    // After all tests
    afterAll(async () => {
        await prisma.$disconnect(); // Close the database connection
    });

    // Before each test
    beforeEach(async () => {
        await prisma.file.deleteMany();
        await prisma.user.deleteMany(); // Clear the user table
    });

    // After each test
    afterEach(async () => {
        await prisma.file.deleteMany();
        await prisma.user.deleteMany(); // Clear the user table
    });

    describe('registerFile', () => {

        it('should throw an error if file already exists', async () => {
           
            const data = {
                email: 'test@example.com',
                password: 'Password123!',
                username: 'testuser'
            };

            const user = await AuthService.register(data);

            const token = await jwt.verifyAccessToken(user.accessToken)

            const fileItem = {
                name: 'testfile.txt',
                originalname: 'text1.txt',
                mimetype: 'text/plain',
                size: 1024,
                buffer: Buffer.from('test content'),
                user: token.payload
            };

            const file = await FileService.registerFile(fileItem);
            
            expect(async () => await FileService.registerFile(fileItem)).rejects.toThrow(`File already uploaded with checksum ${file.checksum}`)

        });

        it('should register a new file successfully', async () => {
            const data = {
                email: 'test@example.com',
                password: 'Password123!',
                username: 'testuser'
            };

            const user = await AuthService.register(data);

            const token = await jwt.verifyAccessToken(user.accessToken)

            const fileItem = {
                name: 'testfile.txt',
                originalname: 'text1.txt',
                mimetype: 'text/plain',
                size: 1024,
                buffer: Buffer.from('test content'),
                user: token.payload
            };

            const file = await FileService.registerFile(fileItem);

            expect(file.filename).toEqual(fileItem.name)
            expect(file.mimetype).toEqual(fileItem.mimetype)
            expect(file.size).toEqual(fileItem.size)
            expect(file.userId).toEqual(fileItem.user.email)
        });

    });

    describe('all', () => {
        it('should return paginated files', async () => {

            const newUser = {
                email: "test@gmail.com",
                password: "K!ueiwuew988",
                username: "ets_893"
              };
          
            const user = await AuthService.register(newUser);

            const token = await jwt.verifyAccessToken(user.accessToken)

            const data = { page: 1, limit: 10, user: token.payload};

            const items = [
                {
                  user: token.payload, 
                  name: 'file1.txt',
                  originalname: 'file1.txt',
                  size: 10000, 
                  mimetype: 'text/plain', 
                  buffer: Buffer.from('Content of file 1').toString('base64'),
                  compressed: true
                },
                {
                  user: token.payload, 
                  name: 'file2.txt',
                  originalname: 'file2.txt',
                  size: 50000, 
                  mimetype: 'text/plain', 
                  buffer: Buffer.from('Content of file 2').toString('base64'), // Convert to base64
                  compressed: true
                },
              ];

              await FileService.registerFile(items[0]);
              await FileService.registerFile(items[1]);

              const res = await FileService.all(data)

            //   expect(res.files.length).toBe(2)
              expect(res.total).toBe(2)
              expect(res.totalPages).toBe(1)
              expect(res.pageNumber).toBe(1)

            
        });

        it('should throw an error if page or limit is invalid', async () => {
            const data = { page: -1, limit: 10 };

            expect(async () => await FileService.all(data)).rejects.toThrow("Page and limit must be positive integers.") 
        });
    });

    describe('updateItem', () => {
        it('should throw an error if file not found', async () => {
            const data = { id: 1, name: 'updatedfile.txt' };

            expect(async () => await FileService.updateItem(data)).rejects.toThrow("File not found") 
        });
        it('should update a file successfully', async () => {
            const newUser = {
                email: "test@gmail.com",
                password: "K!ueiwuew988",
                username: "ets_893"
              };
          
            const user = await AuthService.register(newUser);

            const token = await jwt.verifyAccessToken(user.accessToken)

            const item =  {
                user: token.payload, 
                name: 'file1.txt',
                originalname: 'file1.txt',
                size: 10000, 
                mimetype: 'text/plain', 
                buffer: Buffer.from('Content of file 1').toString('base64'),
                compressed: true
            };

            const file = await FileService.registerFile(item);

            const data = { id: file.id, name: 'updatedfile.txt' };
            const res = await FileService.updateItem(data);

            expect(file.id).toBe(res.id)
            expect(data.name).toBe(res.filename)
        });
    });

    describe('downloadItem', () => {
    //     it('should return a file for download', async () => {
    //         const data = { id: 1 };
    //         const file = { id: 1, compressed: true };

    //         prisma.file.findUnique.mockResolvedValue(file);

    //         const result = await FileService.downloadItem(data);

    //         expect(result).toEqual(file);
    //         expect(prisma.file.findUnique).toHaveBeenCalledWith({
    //             where: { id: data.id },
    //         });
    //     });

    
    
        it('should throw an error if file not found', async () => {
            const data = { id: 1};

            expect(async () => await FileService.downloadItem(data)).rejects.toThrow("File not found") 
        });});

        it('should throw an error if file is not compressed, ready for download', async () => {

            const newUser = {
                email: "test@gmail.com",
                password: "K!ueiwuew988",
                username: "ets_893"
              };
          
            const user = await AuthService.register(newUser);

            const token = await jwt.verifyAccessToken(user.accessToken)

            const item = {
                user: token.payload, 
                name: 'file1.txt',
                originalname: 'file1.txt',
                size: 10000, 
                mimetype: 'text/plain', 
                buffer: Buffer.from('Content of file 1').toString('base64'),
                compressed: false
              }

            const file = await FileService.registerFile(item);

            expect(async () => await FileService.downloadItem({id: file.id})).rejects.toThrow("File not ready to downloaded now. Try again") 
        });
});