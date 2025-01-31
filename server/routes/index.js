const express = require('express');
const router = express.Router();
const auth = require('./auth');
const files = require('./files');
const createError = require('http-errors')

router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.use('/auth', auth);
router.use('/files', files);

router.use( async (req, res, next) => {
    next(createError.NotFound('Route not Found'))
})

router.use( (err, req, res) => {
    res.status(err.status || 500).json({
        status: false,
        message: err.message
    })
})
module.exports = router;