import express from "express"
import { MongoClient } from "mongodb"
import cors from "cors"
import dotenv from "dotenv"
import eventRouter from "./src/routes/events.routes.js"

dotenv.config()

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable")
}

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
const client = new MongoClient(process.env.MONGODB_URI)

async function connectToDatabase() {
  try {
    await client.connect()
    console.log("Connected to MongoDB")
    return client.db(process.env.DB_NAME || "eventDB")
  } catch (err) {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  }
}

;(async () => {
  const db = await connectToDatabase()
  app.locals.db = db

  app.get("/", (req, res) => {
    res.json({
      message: "Bem-vindo à API de Eventos",
      endpoints: {
        events: "/api/events",
        documentation: "todo:",
      },
    })
  })

  app.use("/api/events", eventRouter)

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" })
  })

  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ message: "Internal Server Error" })
  })

  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
})()

process.on("SIGINT", async () => {
  await client.close()
  process.exit(0)
})
