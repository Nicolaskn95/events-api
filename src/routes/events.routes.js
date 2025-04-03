import express from "express"
import {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  searchEvents,
} from "../controller/eventsController.js"
import { validateEvent } from "../middleware/validations.js"

const router = express.Router()

// GET all events
router.get("/", getAllEvents)

// GET events with search
router.get("/search", searchEvents)

// GET single event
router.get("/api/events/:id", getEventById)

// POST create event
router.post("/", validateEvent, createEvent)

// PUT update event
router.put("/api/events/:id", validateEvent, updateEvent)

// DELETE event
router.delete("/api/events/:id", deleteEvent)

export default router
