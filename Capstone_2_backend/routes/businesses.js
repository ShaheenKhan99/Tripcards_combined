"use strict";

/** Routes for businesses. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../ExpressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Business = require("../models/business");
const businessNewSchema = require("../schemas/businessNew.json");
const businessUpdateSchema = require("../schemas/businessUpdate.json");
const businessSearchSchema = require("../schemas/businessSearch.json");


const router = express.Router({ mergeParams: true });


/** Add new business to database /businesses/
 * 
 * POST / { business } => { business }
 *
 * business should be { id, yelp_id, business_name, address1, address2, city, state, country, zip_code, latitude, longitude, phone, url, image_url, rating,, yelpReview_count, sub_category, category_name, category_id, destination_id }
 *
 * Returns { id, yelp_id, business_name, address1, address2, address3, city, state, country, zip_code, latitude, longitude, phone, url, image_url, rating, yelpReview_count, sub_category, category_name, category_id, destination_id }
 *
 * Authorization required: logged in user
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, businessNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
  
    const {
            yelp_id,
            business_name,
            address1,
            address2,
            city,
            state,
            country,
            zip_code,
            latitude,
            longitude,
            phone,
            url,
            image_url,
            rating,
            yelpReview_count,
            sub_category,
            category_name,
            destination_id,
            category_id
    } = req.body;

        
    const business = await Business.create({ 
                    yelp_id,
                    business_name,
                    address1,
                    address2,
                    city,
                    state,
                    country,
                    zip_code,
                    latitude,
                    longitude,
                    phone,
                    url,
                    image_url,
                    rating,
                    yelpReview_count,
                    sub_category,
                    category_name,
                    destination_id,
                    category_id
      });
    return res.status(201).json({ business });
  } catch (err) {
    return next(err);
  }
});

/** GET all businesses from database /businesses
 * GET / =>
 *   { businesses: [ { id, yelp_id, business_name, address1, address2, city, state, country, zip_code, latitude, longitude, phone, url, image_url, rating, yelpReview_count, sub_category, category_name, category_id, destination_id }, ...] }
 *
 * Can provide search filter in query:
 * 
 * - yelp_id
 * - rating
 * - zip_code
 * - business_name (will find case-insensitive, partial matches)
 * - destination_id
 * - city
 * - category_id
 * - category_name (will find case-insensitive, partial matches)
 * 
 * Authorization required: logged-in user
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
  const q = req.query;

  // arrives as strings from querystring, but we want as int/bool
  if (q.destination_id !== undefined) q.destination_id = +q.destination_id;
  if (q.category_id !== undefined) q.category_id = +q.category_id;
  if (q.rating !== undefined) q.rating = +q.rating;

  try {
    const validator = jsonschema.validate(q, businessSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const businesses = await Business.findAll(q);
    return res.json({ businesses });
  } catch (err) {
    return next(err);
  }
});

/** GET business by business id from database /businesses/:business_id
 * GET /[businesss_id] => { business }
 *
 * Business is  { id, yelp_id, business_name, address1, address2, city, state, country, zip_code, latitude, longitude, phone, url, image_url, rating, yelpReview_count, sub_category, category_name, category_id, destination_id, reviews }
 * 
 * where reviews is [{ id, user_id, business_id, text, time_created, url, image_url, rating }, ...]
 *
 * Authorization required: admin or logged in user
 */

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const business = await Business.get(req.params.id);
    return res.json({ business });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[businessId]  { fld1, fld2, ... } => { business }
 *
 * Data can include: {business_name, address1, address2,  zip_code, latitude, longitude, phone, url, rating, yelpReview_count, sub_category, category_name}
 *
 * Returns { id, yelp_id, business_name, address1, address2, city, state, country, zip_code, latitude, longitude, phone, url, image_url, rating, yelpReview_count, sub_category, category_name, category_id, destination_id }
 *
 * Authorization required: admin 
 */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, businessUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const business = await Business.update(req.params.id, req.body);
    return res.json({ business });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Business.remove(req.params.id);
    return res.json({ deleted: +req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;

