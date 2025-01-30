const auth = require('../services/auth.service');
const createError = require('http-errors');
const { body, validationResult } = require('express-validator');

class AuthController {
    static signupValidationRules = [
        body('email')
            .isEmail()
            .withMessage('Invalid email format'),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
        body('username')
            .isLength({ min: 6 })
            .withMessage('Username must be at least 6 characters long')
            .notEmpty()
            .withMessage('Username is required'),
      ];

      static loginValidationRules = [
        body('email')
            .isEmail()
            .withMessage('Invalid email format'),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
            .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
      ];

    static register = async (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await auth.register(req.body);
            res.status(201).json({
                status: true,
                message: 'User created successfully',
                data: user
            })
        }
        catch (e) {
            res.status(e.statusCode).json({
                status: "error",
                message: e.message,
            })
            next(createError(e.statusCode, e.message))
        }
    }
    static login = async (req, res, next) => {
         try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const data = await auth.login(req.body)
            res.status(200).json({
                status: true,
                message: "User logged in successfully",
                data
            })
        } catch (e) {
            res.status(e.statusCode).json({
                status: "error",
                message: e.message,
            })
            next(createError(e.statusCode, e.message))
        }
    }
    static all = async (req, res, next) => {
        try {
            const users = await auth.all();
            res.status(200).json({
                status: true,
                message: 'All users',
                data: users
            })
        }
        catch (e) {
            res.status(e.statusCode).json({
                status: "error",
                message: e.message,
            })
            next(createError(e.statusCode, e.message))
        }
    }
}
module.exports = AuthController;