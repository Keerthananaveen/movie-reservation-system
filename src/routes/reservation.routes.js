import express from "express";
import {
  reserveSeats,
  getReservations,
  cancelReservation,
  getAllReservations
} from "../controllers/reservation.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, reserveSeats);
router.get("/", authenticate, getReservations);
router.delete("/:id", authenticate, cancelReservation);
router.get("/all", authenticate, authorize(["ADMIN"]), getAllReservations);

export default router;