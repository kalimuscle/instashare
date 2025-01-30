const auth = require('../../../middlewares/auth.middleware');
const jwt = require('../../../utils/jwt');
const createError = require('http-errors');
const { describe, it, expect, beforeEach,  } = require('@jest/globals');


jest.mock('../../../utils/jwt');
jest.mock('http-errors');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should call next with Unauthorized error if authorization header is missing', async () => {
        await auth(req, res, next);
        expect(next).toHaveBeenCalledWith(createError.Unauthorized('Access token is required'));
    });

    it('should call next with Unauthorized error if token is missing', async () => {
        req.headers.authorization = 'Bearer ';
        await auth(req, res, next);
        expect(next).toHaveBeenCalledWith(createError.Unauthorized());
    });

    it('should set req.user and call next if token is valid', async () => {
        const user = { id: 1, name: 'Test User' };
        req.headers.authorization = 'Bearer validtoken';
        jwt.verifyAccessToken.mockResolvedValue(user);

        await auth(req, res, next);

        expect(req.user).toEqual(user);
        expect(next).toHaveBeenCalled();
    });

    it('should respond with error and call next with Unauthorized error if token is invalid', async () => {
        const error = { statusCode: 401, message: 'Invalid token' };
        req.headers.authorization = 'Bearer invalidtoken';
        jwt.verifyAccessToken.mockRejectedValue(error);

        await auth(req, res, next);

        expect(res.status).toHaveBeenCalledWith(error.statusCode);
        expect(res.json).toHaveBeenCalledWith({
            status: 'error',
            message: error.message
        });
        expect(next).toHaveBeenCalledWith(createError.Unauthorized(error.message));
    });
});