/** @format */
// swaggerConfig.js
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "API Usuarios",
            version: "1.0.0",
            description: "API para la gestión de usuarios",
        },
        servers: [
            {
                url: "http://localhost:3001",
            },
        ],
    },
    apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
