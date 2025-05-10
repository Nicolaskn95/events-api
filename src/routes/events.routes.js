import express from "express"
import {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  searchEvents,
} from "../controller/events.js"
import { validateEvent } from "../middleware/validations.js"

const router = express.Router()

// GET all events
router.get("/", getAllEvents)

// GET events with search
router.get("/search", searchEvents)

// GET single event
router.get("/:id", getEventById)

// POST create event
router.post("/", validateEvent, createEvent)

// PUT update event
router.put("/:id", validateEvent, updateEvent)

// DELETE event
router.delete("/:id", deleteEvent)

export default router
