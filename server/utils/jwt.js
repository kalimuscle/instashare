require('dotenv').config();
const jwt = require('jsonwebtoken')
const createError = require('http-errors')

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

module.exports = {
    signAccessToken(payload, expiresIn = '1h'){
        return new Promise((resolve, reject) => {
            jwt.sign({ payload }, accessTokenSecret, {expiresIn}, 
            (err, token) => {
                if (err) {
                reject(createError.InternalServerError())
                }
                resolve(token)
            })
        })
    },
    verifyAccessToken(token){
        return new Promise((resolve, reject) => {
            jwt.verify(token, accessTokenSecret, (err, payload) => {
                if (err) {
                    let message;
                    
                    if (err.name === 'TokenExpiredError') 
                        message = 'Token has expired'
                    else if (err.name === 'JsonWebTokenError') 
                        message = 'Unauthorized'

                    return reject(createError.Unauthorized(message || err.message))
                }
                resolve(payload)
            })
        })
    }
}