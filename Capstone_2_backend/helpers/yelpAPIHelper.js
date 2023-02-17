'use strict';

const axios = require('axios');
const BASE_URL = 'https://api.yelp.com/v3';
const apiKey = process.env.YELP_API_KEY;

class yelpAPIHelper {
  
  // Get businesses for given category and location

  static async getBusinesses(term, location) {

    const res = await axios.get(`${BASE_URL}/businesses/search?term=${term}&location=${location}&sort_by=best_match&limit=50`,
                  { headers: 
                        { Authorization: `Bearer ${apiKey}`}
                  },
    );

    const data = res.data;
    
    const businessesDataArray = data.businesses.map(business => ({
      yelp_id: business.id,
      business_name: business.name,
      address1: business.location.address1,
      address2: business.location.address2,
      city: business.location.city,
      state: business.location.state,
      country: business.location.country,
      zip_code: business.location.zip_code,
      latitude: business.coordinates.latitude,
      longitude: business.coordinates.longitude,
      image_url: business.image_url,
      sub_category: business.categories[0].alias,
      category_name: business.categories[0],
      rating: business.rating,
      review_count: business.review_count
    }));
    
    return businessesDataArray;
  }


  // Get details for a business given the yelp_id
  static async getBusinessDetails(yelp_id) {

    const res = await axios.get(`${BASE_URL}/businesses/${yelp_id}`,
                  { headers: 
                        { Authorization: `Bearer ${apiKey}`}
                  },
    );

    const business = res.data;

    const businessData = {
      yelp_id: business.id,
      business_name: business.name,
      url: business.url,
      phone: business.display_phone,
      address1: business.location.address1,
      address2: business.location.address2,
      city: business.location.city,
      state: business.location.state,
      country: business.location.country,
      zip_code: business.location.zip_code,
      latitude: business.coordinates.latitude,
      longitude: business.coordinates.longitude,
      image_url: business.image_url,
      sub_category: business.categories[0].alias,
      category_name: business.categories[0],
      rating: business.rating,
      review_count: business.review_count
    };

    return businessData;
  }


  // get reviews for business
  static async getYelpReviews(yelp_id) {

    const res = await axios.get(`${BASE_URL}/businesses/${yelp_id}/reviews`,
                  { headers: 
                        { Authorization: `Bearer ${apiKey}`}
                  },
    );

    const data = res.data;
    console.log("Reviewdata:", data);

    const reviewsDataArray = data.reviews.map(review => ({
      text: review.text,
      yelp_username: review.user.name,
      time_created: review.time_created,
      url: review.url,
      rating: review.rating
    }));

    return reviewsDataArray;

  }


  // get autocomplete suggestions for search keywords, businesses and categories on the input text

  static async getYelpAutocomplete(text) {

    const res = await axios.get(`${BASE_URL}/autocomplete?text=${text}`,
                  { headers: 
                        { Authorization: `Bearer ${apiKey}`}
                  },
    );

    const data = res.data.terms[0];
    return data;
  }

}

module.exports = yelpAPIHelper;

