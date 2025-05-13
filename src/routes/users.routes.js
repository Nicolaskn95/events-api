import express from "express"
import { createUser, login } from "../controller/users.js"
import { validateUser } from "../middleware/validations.js"

const router = express.Router()

// POST create user
router.post("/", validateUser, createUser)

//POST login user
router.post("/login", login)

export default router
