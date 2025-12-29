import prisma from "../config/prisma.js";
import stripe from "../config/stripe.js";

export const reserveSeats = async (req, res) => {
  const { showtimeId, seats, paymentIntentId } = req.body;
  if (!Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: "seats must be a non-empty array" });
  }
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  if (intent.status !== "succeeded")
    return res.status(400).json({ message: "Payment not completed" });

  const seatStrings = seats.map(s => String(s));
  await prisma.$transaction(async (tx) => {
    const available = await tx.seat.findMany({
      where: {
        showtimeId,
        seatNumber: { in: seatStrings },
        isReserved: false
      }
    });

    if (available.length !== seatStrings.length)
      throw new Error("Seats already reserved");

    await tx.seat.updateMany({
      where: { id: { in: available.map(s => s.id) } },
      data: { isReserved: true }
    });

    const showtime = await tx.showtime.findUnique({
      where: { id: showtimeId }
    });

    await tx.reservation.create({
      data: {
        userId: req.user.id,
        showtimeId,
        seats: seatStrings,
        totalPrice: seatStrings.length * showtime.price,
        paymentIntent: paymentIntentId,
        paymentStatus: "PAID"
      }
    });
  });

  res.json({ message: "Reservation successful" });
};

export const getReservations = async (req, res) => {
  const reservations = await prisma.reservation.findMany({
    where: { userId: req.user.id },
    include: { showtime: true }
  });
  res.json(reservations);
};

export const cancelReservation = async (req, res) => {
  const reservation = await prisma.reservation.findUnique({
    where: { id: parseInt(req.params.id) }
  });
  if (!reservation)
    return res.status(404).json({ message: "Reservation not found" });
  await prisma.$transaction(async (tx) => {
    await tx.seat.updateMany({
      where: {
        showtimeId: reservation.showtimeId,
        seatNumber: { in: reservation.seats }
      },
      data: { isReserved: false }
    });
    await tx.reservation.delete({
      where: { id: reservation.id }
    });
  });
  res.json({ message: "Reservation cancelled" });
};

export const getAllReservations = async (_, res) => {
  const reservations = await prisma.reservation.findMany({
    include: { showtime: true, user: true }
  });
  res.json(reservations);
};       
