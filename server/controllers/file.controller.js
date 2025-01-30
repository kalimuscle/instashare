const fileService = require('../services/file.service');
const multer =  require('multer');
const fs = require('fs');
const path = require('path');
const createError = require('http-errors');
const process = require('process');
const { Buffer } = require('buffer');
// const { check, validationResult } = require('express-validator');

// Configure Multer to handle file uploads in memory

const upload = multer({
  storage: multer.memoryStorage(), // Files are stored in memory as Buffer
//   fileFilter: (req, file, cb) => {
//     const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf'];
//     if (allowedMimeTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Tipo de archivo no permitido'), false);
//     }
//   },
  limits: { files: 3, fileSize: 2 * 1024 * 1024 }, // Limit: 3 files and file size to 2MB
}).array('file', 1);

class FileController {
  // static uploadFileValidationRules = [
  //   check('name')
  //       .isLength({ min: 6 })
  //       .withMessage('File name must be at least 6 characters long')
  //       .notEmpty()
  //       .withMessage('File name is required'),
  // ];
    static uploadFile = async (req, res, next) => {
        await upload(req, res, async (err) => {
            if (err) {
                console.log(err);
              return res.status(400).json({ 
                status: "error",
                message: err.message,
              });
            }

            const {name}  = req.body

            if(!name ){
              return res.status(400).json({ 
                status: "error",
                message: "File name is required",
              });
            }

            if (name.length == 0 || name.length > 120) {
              return res.status(400).json({ message: "File name must be lower than 120 characters." });
            }
            
            const files = req.files;
            if (!files || files.length === 0) {
                return  res.status(400).json({ 
                    status: "error",
                    message: "No file uploaded",
                  });
            }

            if (!req.user) {
              return  res.status(401).json({ 
                  status: "error",
                  message: "Unauthorized access",
                });
          }
        
            try {
              const file = files[0];

              const fileItem = await fileService.registerFile({...req.body, ...file, user: req.user.payload});
              return res.status(201).json({
                status: true,
                message: 'File created and uploaded successfully',
                data: fileItem
              })
        
            } catch (e) {
              res.status(e.statusCode).json({
                status: "error",
                message: e.message,
              })
              next(createError(e.statusCode, e.message))
            }
        });
    }

    static all = async (req, res, next) => {
      
      try {
        let files = await fileService.all({...req.query, user: req.user.payload});

        res.status(200).json({
          status: true,
          message: 'All files',
          data: files
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

  static updateItem = async (req, res, next) => {
      
    try {
      const { id } = req.params;
      const { name } = req.body; 

      if (!id || isNaN(id)) {  
        return res.status(400).json({ message: "File ID not valid" });
      }
    
      // Validación simple
      if (!name) {
        return res.status(400).json({ message: "File name is required." });
      }

      if (name.length == 0 || name.length > 120) {
        return res.status(400).json({ message: "File name must be lower than 120 characters." });
      }

      const updatedFile = await fileService.updateItem({id, name});

      res.status(200).json({
        status: true,
        message: 'Updated file successfully',
        data: updatedFile
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

  static downloadItem = async (req, res, next) => {  
    try {

      const { id } = req.params; // Datos a actualizar

      if (!id || isNaN(id)) {  
        return res.status(400).json({ message: "File ID not valid" });
      }
      const downloadedFile = await fileService.downloadItem(req.params);

      res.setHeader("Content-Disposition", `attachment; filename="${downloadedFile.filename}"`);
      // res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Type', 'application/zip');
      
      const fileBuffer = Buffer.from(downloadedFile.data);

      const sanitizedFilename = downloadedFile.filename.replace(/\s+/g, '_');
      const zipFileName = `${sanitizedFilename}.zip`;

      const downloadsDir = path.join(process.cwd(), '__downloads');
      const zipFilePath = path.join(downloadsDir, zipFileName);

      if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir, { recursive: true });
      }

      fs.writeFileSync(zipFilePath, fileBuffer);
     
      res.download(zipFilePath, zipFileName, (err) => {
        if (err) {
          
          return createError.InternalServerError(`Error downloading file ${downloadedFile.file}`);
        }

        fs.unlink(zipFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting zip file:', unlinkErr);
          }
        });
      });
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
module.exports = FileController;