const { PrismaClient } = require('@prisma/client');
const jwt = require('../../../utils/jwt');
const AuthService = require('../../../services/auth.service');
const { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach } = require('@jest/globals');

const prisma = new PrismaClient();

describe('AuthService', () => {
    // Before all tests
  beforeAll(async () => {
     await prisma.$connect();
  });

  // After all tests
  afterAll(async () => {
     await prisma.$disconnect(); // Closes the database connection
  });

  // Before each test
  beforeEach(async () => {
     await prisma.file.deleteMany();
     await prisma.user.deleteMany(); // Cleans the user table
  });

  // After each test
  afterEach(async () => {
     await prisma.file.deleteMany();
     await prisma.user.deleteMany(); // Cleans the user table
  });

     describe('register', () => {
          it('should register a new user successfully', async () => {
                const data = {
                     email: 'test@example.com',
                     password: 'Password123!',
                     username: 'testuser'
                };

              const user = await AuthService.register(data);

              const res = await jwt.verifyAccessToken(user.accessToken)

                expect(user.email).toEqual(res.payload.email);
                expect(user.username).toEqual(res.payload.name);
                expect(user.password).toEqual(res.payload.password);
          });

          it('should fail, throw an error if user already registered', async () => {
                const data = {
                     email: 'test@example.com',
                     password: 'Password123!',
                     username: 'testuser'
                };

                await AuthService.register(data);
                expect(async () => await AuthService.register(data)).rejects.toThrow("User already registered")
          });
     });

     describe('login', () => {
          it('should fail, throw an error if user not registered', async () => {
                const data = {
                     email: 'test@example.com',
                     password: 'Password123!',
                     username: 'testuser'
                };

                expect(async () => await AuthService.login(data)).rejects.toThrow("User not registered")
          });

          it('should throw an error if password is incorrect', async () => {
                const data = {
                     email: 'test@example.com',
                     password: 'Password123!',
                     username: 'testuser'
                };

                await AuthService.register(data);

                expect(async () => await AuthService.login({
                     email: data.email,
                     password: 'TEETTE!'}
                )).rejects.toThrow("Email address or password not valid")
          });

          it('should login a user successfully', async () => {
                const data = {
                     email: 'test@example.com',
                     password: 'Password123!',
                     username: 'testuser'
                };

                const user = await AuthService.register(data);

                const userLogged = await AuthService.login({
                     email: 'test@example.com',
                     password: 'Password123!'})

                expect(user.username).toEqual(userLogged.name);
                expect(user.email).toEqual(userLogged.email);
                // expect(user.password).toEqual(userLogged.password);
          });

         
     });

     describe('all', () => {
          it('should return all users', async () => {
                const user1 = {
                     email: 'test@example.com',
                     password: 'Password123!',
                     username: 'testuser'
                };

                const user2 = {
                     email: 'test3@example.com',
                     password: 'Passwordf123!',
                     username: 'testuser'
                };

                await AuthService.register(user1);
                await AuthService.register(user2);

                const result = await AuthService.all();

                expect(result.length).toBe(2);
          });
     });
});