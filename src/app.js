import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import showtimeRoutes from "./routes/showtime.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/movies", movieRoutes);
app.use("/showtimes", showtimeRoutes);
app.use("/payments", paymentRoutes);
app.use("/reservations", reservationRoutes);

export default app;
