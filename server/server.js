require('dotenv').config();
const express = require('express');
const cron = require("node-cron");

const bodyParser = require('body-parser');

const swaggerDocs = require("./swaggerConfig"); 
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/files');

const schedules = require('./schedule/zip.schedule');

const cors = require('cors');
// const multer = require('multer');

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware de Swagger
app.use(`/api/${process.env.API_VERSION}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
})

//routes
app.use(`/api/${process.env.API_VERSION}/auth`, authRoutes);
app.use(`/api/${process.env.API_VERSION}/files`,   fileRoutes);

//listen for request
const server = app.listen(process.env.PORT || 5000, () => {
    console.log(`listening on port: ${process.env.PORT}'`);
})

// cron schedules

if (process.env.NODE_ENV !== 'test') {
  cron.schedule("* * * * *", async () => {
    try {
        console.log("Starting task zip_files...");
        await schedules.processFiles();
        console.log("Task completed successfully");
      } catch (error) {
        console.error("Error during scheduled task:", error.message);
      }
});

}

module.exports = {app, server};

