import express from "express";
import {
  createUser,
  login,
  getUser,
  updateUser,
  deleteUser,
} from "../controller/users.controller.js";
import { validateUser } from "../middleware/validations.js";
import authentication from "../middleware/authentication.js";

const router = express.Router();

// POST create user
router.post("/register", validateUser, createUser);

// POST login user
router.post("/login", login);

// GET user
router.get("/", authentication, getUser);

// PUT update user
router.put("/", authentication, updateUser);

// DELETE user
router.delete("/", authentication, deleteUser);

export default router;
