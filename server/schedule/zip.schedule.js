const archiver = require("archiver");
const { PrismaClient } = require("@prisma/client");
const { Buffer } = require("buffer");

const prisma = new PrismaClient();

/**
 * Compress file in zip format.
 * @param {Buffer} fileBuffer - File in buffer format.
 * @param {String} fileName - File name.
 * @returns {Promise<Buffer>} - File compressed.
 */
const compressFile = (fileBuffer, fileName) => {
  if (!Buffer.isBuffer(fileBuffer)) {
    return Promise.reject(new Error("fileBuffer must be a valid Buffer instance"));
  }

  return new Promise((resolve, reject) => {
    const chunks = [];
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("data", (chunk) => chunks.push(chunk));
    archive.on("end", () => resolve(Buffer.concat(chunks)));
    archive.on("error", (err) => reject(err));

    archive.append(fileBuffer, { name: fileName });
    archive.finalize();
  });
};

/**
 * Procesa los archivos pendientes en la base de datos.
 */
const processFiles = async () => {
  console.log("Checking for files to process...");

  const files = await prisma.file.findMany({
    where: { compressed: false}, // Select files with field compressed = false
  });

  for (const file of files) {
    try {
      console.log(`Processing file: ${file.filename}`);

      // Comprimir el archivo
      const fileBuffer = Buffer.from(file.data);
      const compressedData = await compressFile(fileBuffer, `${file.filename}.${file.originalName.split('.').pop()}`);

      // Actualizar la base de datos con el archivo comprimido
      await prisma.file.update({
        where: { id: file.id },
        data: {
          data: compressedData,
          compressed: true,
        },
      });

      console.log(`File ${file.filename} compressed successfully.`);
    } catch (error) {
      console.error(`Error processing file ${file.filename}:`, error);
    }
  }
};

module.exports = {
  processFiles,
};


