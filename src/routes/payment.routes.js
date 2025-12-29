import express from "express";
import {
  createIntent,
  confirmPayment,
  getBookings,
  getAllBookings,
  cancelBooking
} from "../controllers/payment.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-intent", authenticate, createIntent);
router.post("/confirm", authenticate, confirmPayment);
router.get("/bookings", authenticate, getBookings);
router.get("/bookings/all", authenticate, authorize(["ADMIN"]), getAllBookings);
router.delete("/bookings/:id", authenticate, cancelBooking);

export default router;