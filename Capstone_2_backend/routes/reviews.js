"use strict";

/** Routes for reviews. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../ExpressError");
const { ensureAdmin, ensureCorrectUserOrAdmin, ensureLoggedIn } = require("../middleware/auth");
const Review = require("../models/review");

const reviewNewSchema = require("../schemas/reviewNew.json");
const reviewUpdateSchema = require("../schemas/reviewUpdate.json");
const reviewSearchSchema = require("../schemas/reviewSearch.json");

const router = new express.Router();


/** POST /  { state } => { review } 
 * 
 * review should be { id, business_id, business_name, user_id, username, text, rating, created_on, image_url }
 *
 * Returns { id,  business_id, business_name, user_id, username, text, rating, created_on, image_url  }
 *
 * Authorization required: loggedin user
 * 
 * Returns { review }
 * 
*/

router.post("/", ensureLoggedIn, async function (req, res, next) {

  if (req.body.rating !== undefined) req.body.rating = +req.body.rating;

  try {
        const validator = jsonschema.validate(req.body, reviewNewSchema);
        if (!validator.valid) {
          const errs = validator.errors.map(e => e.stack);
          throw new BadRequestError(errs);
        }
        const review = await Review.create(req.body);
        return res.status(201).json({ review });
      } catch(err) {
        return next(err);
      }
  });


/** GET /  =>
 *   { reviews: [ { id, user_id, username, business_id, business_name, text, rating, created_on, image_url }, ...] }
 *
 * Can filter on provided search filters:
 * - user_id
 * - username, 
 * - business_id,
 * - business_name,
 * - rating
 *
 * Authorization required: logged-in user
 */
 

router.get("/", ensureLoggedIn, async function (req, res, next) {
  const q = req.query;

  if (q.rating !== undefined) q.rating = +q.rating;
  if (q.user_id !== undefined) q.user_id = +q.user_id;
  if (q.business_id !== undefined) q.business_id = +q.business_id;

  
  try {
    const validator = jsonschema.validate(q, reviewSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const reviews = await Review.findAll(q);
    return res.json({ reviews });
  } catch (err) {
    return next(err);
  }
});


/** GET /[id]  =>  { review }
 * 
 *  Review is { id, user_id, username, business_id, business_name, text, rating, created_on, image_url } 
 * 
 * Authorization required: logged in user */
 

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const review = await Review.get(req.params.id);
    return res.json({ review });
  } catch (err) {
    return next(err);
  }
});


/** PATCH /[id] { fld1, fld2, ... } => { review }
 *
 * Patches review data.
 * 
 * fields can be: { text, username, image_url, rating }
 *
 * Returns { id, user_id, username, business_id, business_name, text, rating, created_on, image_url }
 *
 * Authorization required: admin or same-user-as-:user_id
 */

router.patch("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
    
  if (req.body.rating !== undefined) req.body.rating = +req.body.rating; 
  
  try {
    const validator = jsonschema.validate(req.body, reviewUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const review = await Review.update(req.params.id, req.body);
    return res.json({ review });
  } catch (err) {
    return next(err);
  }
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: admin or admin or same-user-as-:user_id
 */

router.delete("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    await Review.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;
