import prisma from "../config/prisma.js";

export const createMovie = async (req, res) => {
  const movie = await prisma.movie.createMany({ data: req.body });
  res.json(movie);
};

export const getMovies = async (_, res) => {
  const movies = await prisma.movie.findMany({
    include: { showtimes: true }
  });
  res.json(movies);
};

export const getMovieById = async (req, res) => {
  const movie = await prisma.movie.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { showtimes: true }
  });
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
};

export const updateMovie = async (req, res) => {
  const movie = await prisma.movie.update({
    where: { id: parseInt(req.params.id) },
    data: req.body
  });
  res.json(movie);
};

export const deleteMovie = async (req, res) => {
  await prisma.movie.delete({
    where: { id: parseInt(req.params.id) }
  });
  res.status(204).end();
};
