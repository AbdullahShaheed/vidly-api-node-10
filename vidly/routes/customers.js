const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/api/customers", async (req, res) => {
  const customers = await Customer.find().sort({ name: 1 });
  res.send(customers);
});

router.get("/api/customers/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res.status(404).send("The customer with given id was not found.");

  res.send(customer);
});

router.post("/api/customers", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) {
    let message = "";
    for (let i = 0; i < error.details.length; i++)
      message += error.details[i].message + "\n";

    return res.status(400).send(message);
  }

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  customer = await customer.save();
  res.send(customer);
});

router.put("/api/customers/:id", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    let message = "";
    for (let i = 0; i < error.details.length; i++)
      message += error.details[i].message + "\n";
    return res.status(400).send(message);
  }

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
      isGold: req.body.isGold,
    },
    { new: true }
  );

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given id was not found.");

  res.send(customer);
});

router.delete("/api/customers/:id", auth, async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given id was not found.");

  res.send(customer);
});

module.exports = router;
