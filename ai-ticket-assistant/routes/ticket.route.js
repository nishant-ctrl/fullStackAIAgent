import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
    createTicket,
    getTicket,
    getTickets,
} from "../controllers/ticket.controller.js";
const router = express.Router();

router.post("/", authenticate, createTicket);
router.get("/", authenticate, getTickets);
router.get("/:id", authenticate, getTicket);
export default router;
