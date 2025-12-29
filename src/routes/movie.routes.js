import express from "express";
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie
} from "../controllers/movie.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorize(["ADMIN"]), createMovie);
router.get("/", getMovies);
router.get("/:id", getMovieById);
router.put("/:id", authenticate, authorize(["ADMIN"]), updateMovie);
router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteMovie);

export default router;
