const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

require('dotenv').config();
const crypto = require('crypto');
const createError = require('http-errors')

class FileService {
    static async registerFile(data) { 
        const checksum = crypto.createHash('md5').update(data.buffer || 'utf8').digest('hex');

        // Check for don't upload file again and just
        const fileItem = await prisma.file.findUnique({
            where: {
                checksum: checksum
            }
        });

        if (fileItem) {
            throw createError.Conflict(`File already uploaded with checksum ${checksum}`);
        }

         // Save the file's metadata and binary data in the database
        const fileData = await prisma.file.create({
            data: {
                filename: data.name || data.originalname,
                originalName: data.originalname,
                mimetype: data.mimetype,
                size: data.size,
                data: data.buffer, // Store the binary data from the uploaded file
                checksum,
                userId: data.user.email
            },
        });

  
        return fileData;
      }

    static async all(data) {
        
        const { page, limit } = data;
        
        const pageNumber = parseInt(page || 1);
        const pageSize = parseInt(limit || 10);
        
        if (pageNumber <= 0 || pageSize <= 0) {
            throw createError.NotFound('Page and limit must be positive integers.')
        }
        
        const skip = (pageNumber - 1) * pageSize;
        
        let [files, total] = await prisma.$transaction([
            prisma.file.findMany({
                skip,
                take: pageSize,
                where: {
                    compressed: {
                      equals: true,
                    },
                    userId:{
                        equals: data.user.email
                    }
                },
                orderBy: {
                    uploadedAt: "desc", // Ordenar por fecha de creación
                },
            }),
            prisma.file.count(), // Contar el total de archivos
        ]);

        files = files.map( (file) => ({
            ...file,
            // data: `data:${file.mimetype};base64,${file.data.toString("base64")}`,
            size: file.size
                
        }));
        
        const totalPages = Math.ceil(total / pageSize);
        return {files, total, totalPages, pageNumber}
    }

    static async updateItem(data) {
        const id = parseInt(data.id);
        const file = await prisma.file.findUnique({
            where: {
                id
            }
        });
        if (!file) {
            throw createError.NotFound('File not found')
        }
        const updatedFile = await prisma.file.update({
            where: {
                id
            },
            data: {
                filename: data.name
            }
        });

        return updatedFile;
    }

    static async downloadItem(data) {

        const id = parseInt(data.id);
        const file = await prisma.file.findUnique({
            where: {
                id
            }
        });
        if (!file) {
            throw createError.NotFound('File not found')
        }

        if (!file.compressed) {
            throw createError.Conflict('File not ready to downloaded now. Try again')
        }

        return file;
    }
  }

  module.exports = FileService;