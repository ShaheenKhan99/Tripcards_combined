import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There is no frontend-specific code here, and there is no
 * any API-aware code elsewhere in the frontend.
 *
 */

class TripcardsApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    // Pass the authorization token in the header.
    
    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${TripcardsApi.token}` };
    const params = (method == "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  //--------------------USER ROUTES ---------------------------

  /** Signup for site */

  static async signup(data) {

    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }
  

  /** Get token for login from username, password. */

  static async login(data) {

    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Get the current user.  */

  static async getCurrentUser(id) {

    let res = await this.request(`users/${id}`);
    return res.user;
  }


  /** Save user profile form  data */

  static async saveProfile(id, data) {

    let res = await this.request(`users/${id}`, data, "patch");
    return res.user;
  }

  /** Delete user  */

  static async deleteUser(id) {

    let res = await this.request(`users/${id}`, {}, "delete");
    return res.data;
  }


//----------------------TRIPCARDS ROUTES--------------------------------

  /** Create tripcard */

  static async createTripcard(data) {

    let res = await this.request("tripcards", data, "post");
    return res.tripcard;
  }


   /** Get tripcards (filtered by city) */

  static async getTripcards(city) {

    let res = await this.request("tripcards", { city });
    return res.tripcards;
  }


  /** Get tripcards (filtered by user_id) */

  static async getTripcardsByUserID(user_id) {

    let res = await this.request("tripcards", { user_id });
    return res.tripcards;
  }

  /** Get tripcards filtered by city and/or username */

  static async getTripcardsByCityAndUsername(city, username) {

    let res= await this.request("tripcards", { city, username });
    return res.tripcards;
  }


  /** Get details on a tripcard by id.  */

  static async getTripcard(id) {

    let res = await this.request(`tripcards/${id}`);
    return res.tripcard;
  }


  /** Get tripcardbusinesses for a tripcard by tripcard id */

  static async getTripcardBusinesses(id) {

    let res = await this.request(`tripcards/${id}/businesses`);
    return res.tripcardBusinesses;
  }


  /** Update tripcard data */

  static async updateTripcard(id, data) {

    let res = await this.request(`tripcards/${id}`, data, "patch");
    return res.tripcard;
  }


  /** Add business to specific tripcard */

  static async addBusinessToTripcard(tripcard_id, business_id) {

    let res = await this.request(`tripcards/${tripcard_id}/add/${business_id}`, {}, "post");
    return res.tripcardBusiness;
  }


  /** Remove business from tripcard  */

  static async removeBusinessFromTripcard(tripcard_id, business_id) {

    let res = await this.request(`tripcards/${tripcard_id}/delete/${business_id}`, {}, "delete");
    return res.data;
  }


  /** Delete tripcard  */

  static async deleteTripcard(id) {
    let res = await this.request(`tripcards/${id}`, {}, "delete");
    return res.data;
  }


//------------------DESTINATIONS ROUTES------------------------------

/** Create destination  */  

  static async createDestination(data) {

    let res = await this.request("destinations", data, "post");
    return res.destination;
}

/** Get destinations (filtered by city) */

  static async getDestinations(city, state, country) {

    let res = await this.request("destinations", { city, state, country } );
    return res.destinations;
  }


  /** Get details on a destination by id.  */

  static async getDestination(id) {

    let res = await this.request(`destinations/${id}`);
    return res.destination;
  }


  // -------- CATEGORIES ROUTES ---------------------------------
 
  /** Create category  */  

  static async createCategory(category_name) {

    let res = await this.request("categories", category_name, "post");
    return res.category;
  }
  
  /** Get categories */

  static async getCategories() {

    let res = await this.request("categories");
    return res.categories;
  }


  /** Get category details by id.  */

  static async getCategory(id) {

    let res = await this.request(`categories/${id}`);
    return res.category;
  }


  // -------------------------BUSINESSES ROUTE ----------------------------

  /** Add business to database */

  static async addBusinessToDB(data) {

    let res = await this.request("businesses", data, "post");
    return res.business;
  }
  
   /** Get businesses from database (filtered by city and yelp_id) */

  static async getBusinesses(city, yelp_id) {

    let res = await this.request("businesses", { city, yelp_id});
    return res.businesses;
  }


  /** Get businesses from database (filtered by yelp_id) */

  static async getBusinessesByYelpID(yelp_id) {

    let res = await this.request("businesses", { yelp_id });
    return res.businesses;
  }


   /** Get businesses from database filtered by category and city */

   static async getBusinessesByCategoryAndDestination(category_name, city) {

    let res = await this.request("businesses", { category_name, city });
    return res.businesses;
  }
 

  /** Get details on a business from database by id  */

  static async getBusiness(id) {

    let res = await this.request(`businesses/${id}`);
    return res.business;
  }


  /** Delete business  */

  static async deleteBusiness(id) {

    let res = await this.request(`businesses/${id}`, {}, "delete");
    return res.data;
  }

  
  //------------------REVIEWS ROUTES --------------------------------

  /** Add a review */

  static async addReview(data) {

    let res = await this.request("reviews", data, "post");
    return res.review;
  }


  /** Get list of reviews for a business */

  static async getReviews(business_id) {

    let res = await this.request("reviews", { business_id });
    return res.reviews;
  }


  /** Get review for a specific user */
  static async getReviewsByUser(user_id) {

    let res = await this.request("reviews", { user_id });
    return res.reviews;
  }

  
  /** Get details of a specific review by review id.  */

  static async getReview(id) {
    
    let res = await this.request(`reviews/${id}`);
    return res.review;
  }
  

  /** Update a review by id.   */

  static async updateReview(id, data) {
    
    let res = await this.request(`reviews/${id}`, data, "patch");
    return res.data;
  }


  /** Delete review  */

  static async deleteReview(id) {
    let res = await this.request(`reviews/${id}`, {}, "delete");
    return res.data;
  }


  //----------------YELP API ROUTES --------------------------------------

  /** Get businesses from Yelp API by term and location */

  static async getBusinessesFromYelpApi(term, location) {

    const result = await this.request("api/businesses/search", { term, location });
    return result;
  }


  /** Get business details from Yelp API for a specific business */

  static async getBusinessDetails(yelp_id) {

    const result = await this.request(`api/businesses/${yelp_id}`);
    return result;
  }


  /**  Get reviews from Yelp API for specific business */

  static async getYelpReviews(yelp_id) {

    const result = await this.request(`api/businesses/${yelp_id}/reviews`);
    return result;
  }


  /**  Get autocomplete suggestions from Yelp API */

  static async getAutoComplete(text) {
    const result = await this.request(`api/autocomplete`, {text});
    return result;
  }


}

export default TripcardsApi;