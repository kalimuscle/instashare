const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require('dotenv').config();
const bcrypt = require('bcryptjs');
const createError = require('http-errors')
const jwt = require('../utils/jwt');

class AuthService {
    static async register(data) { 
        
        const userItem = await prisma.user.findUnique({
            where: {
                email: data.email
            }
        });
        if (userItem) {
            throw createError.Conflict('User already registered')
        }
          data.password = bcrypt.hashSync(data.password, 8);

          let user = await prisma.user.create({
            data:{
                email: data.email,
              name: data.username,
              password: data.password
             
            }
              
          })
          data.accessToken = await jwt.signAccessToken(user);
  
          return data;
      }

      static async login(data) {
        const { email, password } = data;
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            throw createError.NotFound('User not registered')
        }
        const checkPassword = bcrypt.compareSync(password, user.password)
        if (!checkPassword) throw createError.Unauthorized('Email address or password not valid')
        delete user.password
        delete user.id
        const accessToken = await jwt.signAccessToken(user)
        const payload = await jwt.verifyAccessToken(accessToken);
        return { ...user, accessToken, ...payload }
    }
    static async all() {
        const allUsers = await prisma.user.findMany();
        return allUsers;
    }
  }

  module.exports = AuthService;