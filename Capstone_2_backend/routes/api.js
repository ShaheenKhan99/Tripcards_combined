"use strict";

/** Routes for using external Yelp API. */

const express = require('express');

const router = new express.Router();
const { ensureLoggedIn } = require("../middleware/auth");
const YelpApi = require('../helpers/yelpAPIHelper');


/** Search businesses on Yelp API by term, location and sort results
 * Authorization required: none
*/
router.get('/businesses/search', async (req, res, next) => {
     const { term, location } = req.query;
     try {
           const results= await YelpApi.getBusinesses(term, location); 
           return res.json(results);
     } catch (err) {
          return next(err);
     }
   });



/** Get business details from Yelp API for a specific business 
 * Authorization required: logged in user
*/
router.get('/businesses/:yelp_id', ensureLoggedIn, async (req, res, next) => {
  try {

        const yelp_id = (req.params.yelp_id);
        const result = await YelpApi.getBusinessDetails(yelp_id);

        return res.json(result);

  } catch (err) {
       return next(err);
  }
});


/** Get reviews from Yelp API for specific business
 * Authorization required: loggedin user
*/
router.get('/businesses/:yelp_id/reviews',  ensureLoggedIn, async (req, res, next) => {
     try {
   
           const yelp_id = (req.params.yelp_id);
           const results = await YelpApi.getYelpReviews(yelp_id);
           return res.json(results);
   
     } catch (err) {
          return next(err);
     }
   });


/** Get autocomplete suggestions from Yelp API  
 * Authorization required: none
*/
   router.get('/autocomplete', async (req, res, next) => {
     try {
           const text = (req.body);

           const result = await YelpApi.getYelpAutocomplete(text);
   
           return res.json(result);
   
     } catch (err) {
          return next(err);
     }
   });
   

module.exports = router;


