import prisma from "../config/prisma.js";

export const createShowtime = async (req, res) => {
  const { movieId, startTime, price, capacity } = req.body;
  const showtime = await prisma.showtime.create({
    data: {
      movieId,
      startTime,
      price,
      capacity,
      seats: {
        createMany: {
          data: Array.from({ length: capacity }).map((_, i) => ({
            seatNumber: `S${i + 1}`
          }))
        }
      }
    }
  });
  res.json(showtime);
};

export const getShowtimes = async (_, res) => {
  const showtimes = await prisma.showtime.findMany({
    include: { movie: true }
  });
  res.json(showtimes);
};

export const getShowtimeById = async (req, res) => {
  const showtime = await prisma.showtime.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { movie: true, seats: true }
  });
  if (!showtime) return res.status(404).json({ message: "Showtime not found" });
  res.json(showtime);
};

export const updateShowtime = async (req, res) => {
  const showtime = await prisma.showtime.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(showtime);
};

export const deleteShowtime = async (req, res) => {
  await prisma.showtime.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.status(204).end();
};
