"use strict";

/** Routes for tripcards. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../ExpressError");
const { ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");
const Tripcard = require("../models/tripcard");

const tripcardNewSchema = require("../schemas/tripcardNew.json");
const tripcardUpdateSchema = require("../schemas/tripcardUpdate.json");
const tripcardSearchSchema = require("../schemas/tripcardSearch.json");


const router = new express.Router();


/** POST /  { state } => { tripcard } 
 * 
 * Creates a new tripcard 
 * 
 * Returns { tripcard }
 * 
 * Authorization required: logged in user
*/

router.post("/", ensureLoggedIn, async function (req, res, next) {
  try {
        const validator = jsonschema.validate(req.body, tripcardNewSchema);
          if (!validator.valid) {
              const errs = validator.errors.map(e => e.stack);
              throw new BadRequestError(errs);
            }

          const tripcard = await Tripcard.create(req.body);
          return res.status(201).json({ tripcard });
      } catch(err) {
          return next(err);
      }
  });


/** POST /[id]/add/[business_id] { tripcard } =>  { tripcardBusiness }
 *
 * Adds a business to a tripcard 
 * 
 * tripcardBusiness should be { tripcard_id, business_id }
 *
 * Returns { id, tripcard_id, business_id }
 *
 * Authorization required: admin or same user-as-:user_id
 */

 router.post("/:id/add/:business_id", ensureCorrectUserOrAdmin, async (req, res, next) => {
            
      try {
            const tripcard_id = req.params.id;
            const business_id = req.params.business_id;
      
            const tripcardBusiness = await Tripcard.addBusinessToTripcard(tripcard_id, business_id);
            return res.status(201).json({ tripcardBusiness });
          } catch (err) {
              return next(err);
          }
  });



/** GET /  =>
 *   { tripcards: [ { id, destination_id, user_id, username, created_on, keep_private, has_visited }, ...] }
 *
 * Can filter on provided search filters:
 * - destination_id
 * - user_id
 * - username
 * - city
 * - state
 * - country
 * - has_visited
 * 
 *
 * Authorization required: logged in user
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
  const q = req.query;

  if (q.user_id !== undefined) q.user_id = +q.user_id;
  
  try {
    const validator = jsonschema.validate(q, tripcardSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const tripcards = await Tripcard.findAll(q);
    return res.json({ tripcards });
  } catch (err) {
    return next(err);
  }
});


/** GET /[id]  =>  { tripcard }
 *
 *  Tripcard is { id, destination_id, user_id, username, city, state, country, created_on, keep_private, has_visited} 
 *
 * Authorization required: logged in user
 */

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
        const tripcard = await Tripcard.get(req.params.id);
          return res.json({ tripcard });
      } catch (err) {
        return next(err);
      }
});


/** GET /[id]/businesses  =>  { tripcard }
 *
 *  Get tripcardBusinesses for tripcard
   where business is [{ id, yelp_id, business_name, address1, address2,  city, state, country, zip_code, latitude, longitude, phone, url, image_url, rating, sub_category, category_id, destination_id }, ...]
 *
 * Authorization required: logged in user
 */
 router.get("/:id/businesses", ensureLoggedIn, async function (req, res, next) {
        
    try {
        const tripcardBusinesses = await Tripcard.getTripcardBusinesses(req.params.id);
        return res.json({ tripcardBusinesses })  
        } catch (err) {
          return next(err);
        }
  });


/** DELETE  [tripcard_id]/[business_id]  =>  { deleted: id }
 *
 * Authorization required: admin or same user-as-:user_id
 */

router.delete("/:id/delete/:business_id", ensureCorrectUserOrAdmin, async (req, res, next) => {
    try {
          const id = req.params.id;
          const business_id = req.params.business_id

          await Tripcard.removeBusinessFromTripcard(id, business_id);
          return res.json({ message: "Business removed from tripcard" });
        } catch (err) {
           return next(err);
        }
});


/** PATCH /[id] { fld1, fld2, ... } => { tripcard }
 *
 * Patches tripcard data.
 * 
 * fields can be: { keep_private, has_visited }
 *
 * Returns { id, destination_id, user_id, username, city, state, country, created_on, keep_private, has_visited }
 *
 * Authorization required: admin or same user-as-:user_id
 */

router.patch("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, tripcardUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }
    const tripcard = await Tripcard.update(req.params.id, req.body);
    return res.json({ tripcard });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin or same user-as-:user_id
 */

router.delete("/:id", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
    await Tripcard.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

