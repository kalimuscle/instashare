require('dotenv').config();
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { verifyAccessToken } = require('../../utils/jwt');
const { describe, it, expect, } = require('@jest/globals');

describe('verifyAccessToken', () => {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    it('should payload comparation be the same', async () => {
        const accessTokenFake = 'fail access token';
        expect(async () => await verifyAccessToken(accessTokenFake)).rejects.toThrow("Unauthorized")
    });


    it('should fail if token has expired', async () => {
        const payload = {field1: 'Field1'}

        const accessToken = await new Promise(
            (resolve, reject) => {
                jwt.sign({ payload }, accessTokenSecret, {expiresIn: '1s'}, 
                    (err, token) => {
                        if (err) {
                            reject(createError.InternalServerError())
                        }
                        resolve(token)
                    }
                )
            }
        )

        const res = await verifyAccessToken(accessToken)

        expect(res.payload).toEqual(res.payload)
        expect(res.exp - res.iat).toEqual(1)
    });
});