const Joi = require("joi");
const mongoose = require("mongoose");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: { type: String, required: true },
    phone: String,
    isGold: { type: Boolean, default: false },
  })
);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().required(),
    phone: Joi.string(),
    isGold: Joi.bool(),
  };
  return Joi.validate(customer, schema, { abortEarly: false });
}

exports.Customer = Customer;
exports.validate = validateCustomer;
