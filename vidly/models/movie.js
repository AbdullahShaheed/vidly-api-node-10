const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const Movie = mongoose.model(
  "Movie",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
    },
    //Embedding genre document inside movie document, in addition to the standalone genres collection.
    //So, it is hybrid approach of connected data.
    genre: { type: genreSchema, required: true },
    numberInStock: { type: Number, required: true },
    dailyRentalRate: { type: Number, required: true },
  })
);

//This is the joi schema, this is what the client send us. It is the input to our API
function validateMovie(movie) {
  const schema = {
    title: Joi.string().required(),
    genreId: Joi.string().required(), //I think that the client should also name it genreId . So, an agreement must be between the frontend and backend developers about this property in the request's body
    numberInStock: Joi.number().min(0).max(200).required(),
    dailyRentalRate: Joi.number().min(0).max(100).required(),
  };
  return Joi.validate(movie, schema, { abortEarly: false });
}

exports.Movie = Movie;
exports.validate = validateMovie;
