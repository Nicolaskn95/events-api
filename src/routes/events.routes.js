import express from "express"
import authentication from "../middleware/authentication.js"
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
router.get("/", authentication, getAllEvents)

// GET events with search
router.get("/search", authentication, searchEvents)

// GET single event
router.get("/:id", authentication, getEventById)

// POST create event
router.post("/", authentication, validateEvent, createEvent)

// PUT update event
router.put("/:id", authentication, validateEvent, updateEvent)

// DELETE event
router.delete("/:id", authentication, deleteEvent)

export default router
