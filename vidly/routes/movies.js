const { Movie, validate } = require("../models/movie");
const auth = require("../middleware/auth");
const { Genre } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.get("/api/movies", async (req, res) => {
  const movies = await Movie.find().sort({ name: 1 });
  res.send(movies);
});

router.get("/api/movies/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with given id was not found.");

  res.send(movie);
});

router.post("/api/movies", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    let message = "";
    for (let i = 0; i < error.details.length; i++)
      message += error.details[i].message + "\n";

    return res.status(400).send(message);
  }

  const genre = await Genre.findById(req.body.genreId); //I think that the client should also name it genreId (there must be an agreement between the frontend and backend developers about this name)
  if (!genre) return res.status(404).send("Invalid genre.");

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  movie = await movie.save();
  res.send(movie);
});

router.put("/api/movies/:id", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    let message = "";
    for (let i = 0; i < error.details.length; i++)
      message += error.details[i].message + "\n";
    return res.status(400).send(message);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );
  if (!movie)
    return res.status(404).send("The movie with the given id was not found.");

  res.send(movie);
});

router.delete("/api/movies/:id", auth, async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given id was not found.");

  res.send(movie);
});

module.exports = router;
