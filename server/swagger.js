// i swaggerJsdoc = require("swagger-jsdoc");
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My MERN APIs",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
  apis: ["./routes/*.js"], // 👈 your routes folder
};
const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec
