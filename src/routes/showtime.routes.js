import express from "express";
import {
  createShowtime,
  getShowtimes,
  getShowtimeById,
  updateShowtime,
  deleteShowtime
} from "../controllers/showtime.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorize(["ADMIN"]), createShowtime);
router.get("/", getShowtimes);
router.get("/:id", getShowtimeById);
router.put("/:id", authenticate, authorize(["ADMIN"]), updateShowtime);
router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteShowtime);

export default router;