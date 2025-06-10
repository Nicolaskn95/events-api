import express from "express";
import authentication from "../middleware/authentication.js";
import {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  searchEvents,
} from "../controller/events.controller.js";
import { validateEvent } from "../middleware/validations.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - location
 *         - capacity
 *         - ticketPrice
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the event
 *         description:
 *           type: string
 *           description: The description of the event
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date and time of the event
 *         location:
 *           type: string
 *           description: The location of the event
 *         capacity:
 *           type: number
 *           description: The capacity of the event
 *         ticketPrice:
 *           type: number
 *           description: The price of the event ticket
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Returns all events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: Unauthorized
 */
router.get("/", authentication, getAllEvents);

/**
 * @swagger
 * /api/events/search:
 *   get:
 *     summary: Search events
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: List of matching events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: Unauthorized
 */
router.get("/search", authentication, searchEvents);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/", authentication, validateEvent, createEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.put("/:id", authentication, validateEvent, updateEvent);

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.delete("/:id", authentication, deleteEvent);

export default router;
