import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.js";
import eventRouter from "./routes/events.routes.js";
import usersRouter from "./routes/users.routes.js";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable");
}

if (!process.env.MONGODB_DB_NAME) {
  throw new Error("Missing MONGODB_DB_NAME environment variable");
}

const app = express();

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "access_token",
    "Origin",
    "X-Requested-With",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// MongoDB Connection
const client = new MongoClient(process.env.MONGODB_URI);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(process.env.MONGODB_DB_NAME);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

(async () => {
  const db = await connectToDatabase();
  app.locals.db = db;

  // Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Events API Documentation",
    })
  );

  app.use("/api/events", eventRouter);
  app.use("/api/users", usersRouter);

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Swagger UI is running on http://localhost:3001/api-docs");
    console.log(`Server is running on port ${PORT}`);
  });
})();

process.on("SIGINT", async () => {
  await client.close();
  process.exit(0);
});
