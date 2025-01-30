require('dotenv').config();
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');

const file = require('../controllers/file.controller');

/**
 * @swagger
 * tags:
 *   name: Files
 *   description: User file management (list, upload, update, and download files).
 */

/**
 * @swagger
 * /files/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload (max 2MB, allowed types - any).
 *               name:
 *                 type: string
 *                 description: Name of the file (required, max 120 characters).
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error (e.g., missing file, invalid file name, or file size exceeded).
 *       401:
 *         description: Unauthorized access (user not authenticated).
 *       500:
 *         description: Internal server error.
 */
router.post('/upload', auth, file.uploadFile);


/**
 * @swagger
 * /files:
 *   get:
 *     summary: Get all files
 *     tags: [Files]
 *     responses:
 *       200:
 *         description: List of files retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Unauthorized access (user not authenticated).
 *       500:
 *         description: Internal server error.
 */
router.get('/', auth, file.all);


/**
 * @swagger
 * /files/download/{id}:
 *   get:
 *     summary: Download a file
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the file to download.
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *         content:
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Validation error (e.g., invalid file ID).
 *       401:
 *         description: Unauthorized access (user not authenticated).
 *       500:
 *         description: Internal server error.
 */

router.get('/download/:id', auth, file.downloadItem);

/**
 * @swagger
 * /files/{id}:
 *   put:
 *     summary: Update a file's name
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the file to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name for the file (required, max 120 characters).
 *     responses:
 *       200:
 *         description: File name updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *       400:
 *         description: Validation error (e.g., invalid file ID or file name).
 *       401:
 *         description: Unauthorized access (user not authenticated).
 *       500:
 *         description: Internal server error.
 */
router.put('/:id', auth, file.updateItem);

module.exports = router;



