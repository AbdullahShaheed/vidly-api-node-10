const Joi = require("joi");
const mongoose = require("mongoose");

//This is a custom short schema, we are not reusing the customer schema that we defined in the customer module
//because customer can have 50 properties. We don't want to have all those properties inside rental object
//We only need these primary properties that we need when dosplaying the list of rentals.
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 255,
  },
  isGold: { type: Boolean, default: false },
  phone: { type: String, minLength: 5, maxLength: 50 },
});

//The same thing for the movie
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 100 }, //means rental price for one day
});

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: { type: customerSchema, required: true },
    movie: { type: movieSchema, required: true },
    dateOut: { type: Date, required: true, default: Date.now },
    dateReturned: Date,
    rentalFee: { type: Number, min: 0 },
  })
);

function validateRental(rental) {
  //Note that the schema we have here is very different from the schema we defined
  //for our rental documents. So, here we only have two properties. These are the
  //properties that the client sends to the server because dateOut, dateReturned, and
  //rentalFee should be set on the server
  const schema = {
    customerId: Joi.string().required(),
    movieId: Joi.string().required(),
  };

  return Joi.validate(rental, schema);
}

module.exports.validate = validateRental;
module.exports.Rental = Rental;
