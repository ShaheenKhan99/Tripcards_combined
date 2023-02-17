"use strict";

/** Routes for helper functions */

const express = require("express");

const { ExpressError } = require("../ExpressError");

const Tripcard = require("../models/tripcard");

const router = new express.Router();


/** GET /  =>
 *   { destinations: [ { id, city, state, country }, ...] }
 *
 * Authorization required: none
 */

router.get("/topdestinations", async function(req, res, next) {
  try {
    const destinations = await Tripcard.findTopDestinations();
    return res.json({ destinations })
  } catch (err) {
    return next(err);
  }
});

router.get("/topdestinations2", async function(req, res, next) {
  try {
    const limit = req.query;
    const destinations = await Tripcard.findTopDestinations(limit);
    return res.json({ destinations })
  } catch (err) {
    return next(err);
  }
});



module.exports = router;