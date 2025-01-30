const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Instashare",
      version: "1.0.0",
      description: "API documentation",
    },
    // servers: [
    //   {
    //     url: "http://localhost:3000",
    //     description: "Servidor local",
    //   },
    // ],
  },
  apis: ["./routes/*.js"], // Archivos donde documentarás tus endpoints
};

module.exports = swaggerJsdoc(swaggerOptions);
