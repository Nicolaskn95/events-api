import express from "express"
import { createUser } from "../controller/users.js"
import { validateUser } from "../middleware/validations.js"

const router = express.Router()

// POST create user
router.post("/", validateUser, createUser)

export default router
