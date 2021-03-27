const { Rental, validate } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/api/rentals", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/api/rentals", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    let message = "";
    for (let i = 0; i < error.details.length; i++)
      message += error.details[i].message + "\n";
    return res.status(400).send(message);
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  rental = await rental.save();
  movie.numberInStock--;
  movie.save();
  res.send(rental);
});

module.exports = router;
