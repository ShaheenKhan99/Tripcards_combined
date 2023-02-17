"use strict";

/** Routes for destinations. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../ExpressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Destination = require("../models/destination");

const destinationNewSchema = require("../schemas/destinationNew.json");
const destinationUpdateSchema = require("../schemas/destinationUpdate.json");
const destinationSearchSchema = require("../schemas/destinationSearch.json");

const router = new express.Router();

/** POST / { destination } =>  { destination }
 *
 * destination should be { id, city, state, country, latitude, longitude }
 *
 * Returns { id, city, state, country, latitude, longitude}
 *
 * Authorization required: logged-in user
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, destinationNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const destination = await Destination.create(req.body);
    return res.status(201).json({ destination });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { destinations: [ { id, city, state, country, latitude, longitude }, ...] }
 *
 * Can filter on provided search filters:
 * - city
 * - state
 * - country (will find case-insensitive, partial matches)
 *
 * Authorization required: logged in user
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
  const q = req.query;
  
  try {
    const validator = jsonschema.validate(q, destinationSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const destinations = await Destination.findAll(q);
    return res.json({ destinations });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  =>  { destination }
 * 
 *  Destination is { id, city, state, country, latitude, longitude } 
 *
 * Authorization required: loggedin user
 */

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const destination = await Destination.get(req.params.id);
    return res.json({ destination });
  } catch (err) {
    return next(err);
  }
});



/** PATCH /[id] { fld1, fld2, ... } => { destination }
 *
 * Patches destination data.
 * 
 * fields can be: { city, state }
 *
 * Returns { id, city, state, country, latitude, longitude }
 *
 * Authorization required: admin
 */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, destinationUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const destination = await Destination.update(req.params.id, req.body);
    return res.json({ destination });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Destination.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
