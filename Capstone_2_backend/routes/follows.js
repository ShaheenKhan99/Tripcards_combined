"use strict";

/** Routes for follows */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, UnauthorizedError } = require("../ExpressError");
const { ensureAdmin, ensureLoggedIn, ensureCorrectUserOrAdmin } = require("../middleware/auth");

const Follow = require("../models/follow");

const followNewSchema = require("../schemas/followNew.json");

const router = new express.Router();


/** POST / { user_id/add } =>  { follow }
 *
 * follow should be { id, user_being_followed_id, user_following_id }
 *
 * Returns { id, user_being_followed_id, user_following_id }
 *
 * Authorization required: logged in user
 */

router.post("/user_id/add", ensureLoggedIn, async (req, res, next) => {
  try {
    const validator = jsonschema.validate(req.body, followNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const { user_following_id } = req.params;
    const { user_being_followed_id } = req.body;

    const follow = await Follow.followUser(user_following_id, user_being_followed_id );

    return res.status(201).json({ follow });
  } catch (err) {
    return next(err);
  }
});


/*** Get a list of all users a user is following
   * 
   * Authorization required: logged in user
   */

router.get("/:id/following", ensureLoggedIn, async function (req, res, next) {
  try {

    const user_following_id = req.params.id;
    const following = await Follow.getUsersFollowed(user_following_id);
  
    return res.json({ following });
    } catch (err) {
    return next(err);
  }
});


/** Get a list of all followers for a specific user
   * 
   * Authorization required: logged in user
   */

  router.get("/:id/followed", ensureLoggedIn, async function (req, res, next) {
  try {
        const user_being_followed_id = req.params.id;
        const followed = await Follow.getAllFollowers(user_being_followed_id);
  
        return res.json({ followed });
      } catch (err) {
        return next(err);
  }
});


/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization required: admin or same user-as-:username
 */

router.delete("/:id/delete", ensureCorrectUserOrAdmin, async function (req, res, next) {
  try {
        const { user_following_id } = req.params.user_id;
        const { user_being_followed } = req.body;

        const follow = await Follow.unFollowUser(user_following_id, user_being_followed );

        return res.json({ deleted: follow });
      } catch (err) {
          return next(err);
      }
});



module.exports = router;
