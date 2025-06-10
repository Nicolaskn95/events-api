import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Events API Documentation",
      version: "1.0.0",
      description: "API documentation for the Events management system",
      contact: {
        name: "API Support",
        email: "support@eventsapi.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Development server",
      },
      {
        url: "https://events-api-eta-seven.vercel.app",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: ["*"],
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to the API routes
};

export const specs = swaggerJsdoc(options);
