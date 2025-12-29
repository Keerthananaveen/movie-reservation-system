import prisma from "../config/prisma.js";
import stripe from "../config/stripe.js";

export const createIntent = async (req, res) => {
  const { showtimeId, seats } = req.body;
  const id = typeof showtimeId === "string" ? parseInt(showtimeId, 10) : showtimeId;
  if (!id || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: "showtimeId and seats are required" });
  }
  const showtime = await prisma.showtime.findUnique({ where: { id } });
  if (!showtime) {
    return res.status(404).json({ message: "Showtime not found" });
  }
  const amount = Math.round(showtime.price * seats.length * 100);
  const intent = await stripe.paymentIntents.create({ amount, currency: "usd" });
  res.json({ clientSecret: intent.client_secret, paymentIntentId: intent.id });
};

export const confirmPayment = async (req, res) => {
  const { paymentIntentId, showtimeId, seats } = req.body;
  if (!Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: "seats must be a non-empty array" });
  }
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (paymentIntent.status !== "succeeded")
    return res.status(400).json({ message: "Payment not completed" });
  const showtime = await prisma.showtime.findUnique({ where: { id: showtimeId } });
  if (!showtime) return res.status(404).json({ message: "Showtime not found" });
  const seatStrings = seats.map(s => String(s));
  const reservation = await prisma.reservation.create({
    data: {
      showtimeId,
      userId: req.user.id,
      seats: seatStrings,
      totalPrice: seats.length * showtime.price,
      paymentIntent: paymentIntentId,
      paymentStatus: "PAID"
    }
  });
  res.json(reservation);
};

export const getBookings = async (req, res) => {
  const reservations = await prisma.reservation.findMany({
    where: { userId: req.user.id },
    include: { showtime: true }
  });
  res.json(reservations);
};

export const getAllBookings = async (_, res) => {
  const reservations = await prisma.reservation.findMany({
    include: { showtime: true, user: true }
  });
  res.json(reservations);
};

export const cancelBooking = async (req, res) => {
  const reservation = await prisma.reservation.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.json(reservation);
};
