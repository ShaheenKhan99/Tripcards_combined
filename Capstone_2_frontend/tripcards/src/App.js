import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./routes-nav/Navigation";
import AppRoutes from "./routes-nav/AppRoutes";
import TripcardsApi from "./api/api";
import UserContext from "./auth/UserContext";
import LoadingSpinner from "./common/LoadingSpinner";
import { fullDestination } from "./common/Helpers";

import { decodeToken } from "react-jwt";


// Key name for storing token in localStorage for "remember me" re-login 
export const  TOKEN_STORAGE_ID = "tripcards-token";


/** Tripcards application 
 * 
 * - infoLoaded: has user data been pulled from API?
 *  (this manages spinner for "loading...")
 * 
 * - currentUser: user obj from API. This becomes the canonical way to tell if someone is logged in. This is passed around via context throughout the app.
 * 
 * -token: for logged in users, this is their authentication JWT. 
 * Is required to be set for most API calls. This is initially read from localStorage and synced to there via the useLocalStorage hook.
 * 
 * App -> Routes
*/

const App = () => {

  const [infoLoaded, setInfoLoaded] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  const [tripcardIds, setTripcardIds] = useState(new Set([]));

  const [tripcards, setTripcards] = useState(new Set([]));

  const [tripcard, setTripcard] = useState(null);

  const [deletedTripcard, setDeletedTripcard] = useState([]);
 
  const [review, setReview] = useState(null);

  const [reviews, setReviews] = useState([]);

  const [currentUserReviews, setCurrentUserReviews] = useState();

  const [currentUserTripcards, setCurrentUserTripcards] = useState();

  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);


  console.debug("App", 
                "infoLoaded=", 
                infoLoaded, 
                "currentUser=", 
                currentUser, 
                "token=", 
                token);

  // Load user info from API. Until a user is logged in and they have a token, this should not run. It only needs to re-run when a user logs out, so the value of the token is a dependency for this effect.

  useEffect(function loadUserInfo() {
    console.debug("app useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { id } = decodeToken(token);

          // put the token on the Api class so it can use it to call the API.
          TripcardsApi.token = token;

          let currentUser = await TripcardsApi.getCurrentUser(id);

          setCurrentUser(currentUser);

          setTripcardIds(new Set(currentUser.tripcards));

          setCurrentUserTripcards(currentUser.tripcards);

          setCurrentUserReviews(currentUser.reviews);

        } catch (err) {
          console.error("app loadUserInfo: problem loading", err);

          setCurrentUser(null);
        }
      }
    }
    
    // set infoLoaded to false while async getCurrentuser runs; once the data is fetched or even if an error happens, this will be set back to false to control the spinner.

    setInfoLoaded(false);
    getCurrentUser();
    setInfoLoaded(true);

  }, [token]);


  /** Handles site-wide signup
   * 
   * Automatically logs them in (set token) upon signup.
   * 
   * Await this function and check return value
   */

  async function signup(signupData) {

    try {
      let token = await TripcardsApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }


  /** Handles site-wide login.
   * 
   * Make sure to await this function and check its return value.
   */

   async function login(loginData) {

    try {
      let token = await TripcardsApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      return { success: false, errors };
    }
  }

  /** Handles site-wide logout */
  function logout() {
    setCurrentUser(null);
    setToken(null);
  }


  /** Checks if user has created tripcard for city */

  async function hasCreatedDestinationTripcard(id){

    if (currentUserTripcards) {
      let business = await TripcardsApi.getBusiness(id);
      let tripcard = currentUserTripcards.find(tripcard => fullDestination (tripcard) == fullDestination(business));

      if (tripcard) {
        setTripcard(tripcard);
        return true;
      }
    }      
  }   


  async function hasCreatedYelpDestinationTripcard(yelp_id){

    let business = await TripcardsApi.getBusinessDetails(yelp_id);

    if (currentUserTripcards) {
      const tripcard = currentUserTripcards.find(tripcard => fullDestination (tripcard) == fullDestination(business));
      if (tripcard) {
        setTripcard(tripcard);
        return true;
      }  
    }
  }


  /** Create a tripcard for a destination: make API call and update set of tripcard IDs */

  async function createTripcard(data) {

    try { 
      const tripcard = await TripcardsApi.createTripcard(data);
      setTripcard(tripcard);
      setTripcardIds(new Set([...tripcardIds, data.destination_id]));
      setTripcards([...tripcards, tripcard]);
      setCurrentUserTripcards([...currentUserTripcards, tripcard])
    } catch (err) {
      console.error("Could not create tripcard", err);
      return { success: false, err};
    }    
  }


  /** Deletes specific tripcard for user */

  async function removeTripcard(evt, id) {
    evt.preventDefault();

    try {
      setDeletedTripcard(await TripcardsApi.deleteTripcard(id));
      setTripcardIds(tripcardIds.delete(id));      
      setTripcards(tripcards.delete(id));
      setCurrentUserTripcards(currentUserTripcards.filter((tripcard) => {
          return tripcard.id !== id;
      }))    
    } catch (err) {
      console.error("Could not delete", err.message);
      return { success: false, err};
    }
  }


  /** Checks if user has added specific business to tripcard */

  async function hasAddedTripcardBusiness(business_id){
   
    if (currentUserTripcards){
      const business = await TripcardsApi.getBusiness(business_id);

      const tripcard = currentUserTripcards.find(tripcard => 
        fullDestination (tripcard) == fullDestination(business));

        if(tripcard) {
          setTripcard(tripcard);

          let tripcardbusinesses = await TripcardsApi.getTripcardBusinesses(tripcard.id);
          
          if (tripcardbusinesses) {
            const tripcardbusiness = tripcardbusinesses.find(t => t.id == business.id);
            
            if (tripcardbusiness)
            return true;
          }
        } 
     } 
  }


  /** Checks if user has added specific Yelp business to tripcard */

  async function hasAddedYelpBusinessToTripcard(yelp_id){

    if (currentUserTripcards){
        const businessRes = await TripcardsApi.getBusinessesByYelpID(yelp_id);

        if (businessRes) {
          let business = businessRes[0];
          
          const tripcard = currentUserTripcards.find(tripcard => 
            fullDestination (tripcard) == fullDestination(business));

          if(tripcard) {
             setTripcard(tripcard);
             let tripcardbusinesses = await TripcardsApi.getTripcardBusinesses(tripcard.id);

              if (tripcardbusinesses) {
                const tripcardbusiness = tripcardbusinesses.find(t => t.id == business.id);
  
                if(tripcardbusiness) 
                return true;
              }
            } 
        } 
      } 
  }
   

  /** Add a business to specific tripcard: make API call and save business to tripcard. */

  async function addBusinessToTripcard(tripcard_id, business_id){
    try {
      await TripcardsApi.addBusinessToTripcard(tripcard_id, business_id);
    } catch (err) {
      console.error("failed to add business to tripcard", err);
      return { success: false, err };
    }
  }


  /** Remove a business from a specific tripcard */
  async function deleteBusinessFromTripcard(tripcard_id, business_id) {
    try {
      await TripcardsApi.removeBusinessFromTripcard(tripcard_id, business_id);
    } catch (err) {
      console.error("Could not delete", err);
      return { success: false, err };
    }
  }


  /** Checks if user has reviewed a specific business */

  async function hasReviewedBusiness(business_id) {

    if(currentUserReviews) {
      const review =  currentUserReviews.find((review) => review.business_id == business_id);
      if (review) {
        return true;
      }
    }  
  }


  /** Add a review for a business: make API call and update set of reviews throughout the site */

  async function createReview(data) {
    try { 
      const review = await TripcardsApi.addReview(data);
      setReview(review);
      setReviews([...reviews, review]);
      setCurrentUserReviews([...currentUserReviews, review])
    } catch (err) {
      console.error("Could not create review", err);
      return { success: false, err};
    }    
  }


  if (!infoLoaded) return <LoadingSpinner />;
 
  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currentUser, 
                                      setCurrentUser,
                                      hasCreatedDestinationTripcard,
                                      hasCreatedYelpDestinationTripcard,
                                      tripcard,
                                      setTripcard,
                                      tripcardIds,
                                      createTripcard,
                                      removeTripcard,
                                      tripcards,
                                      setTripcards,
                                      currentUserTripcards,
                                      setCurrentUserTripcards,
                                      hasAddedTripcardBusiness,
                                      hasAddedYelpBusinessToTripcard,
                                      addBusinessToTripcard,
                                      deleteBusinessFromTripcard,
                                      review,
                                      setReview,
                                      createReview,
                                      reviews,
                                      setReviews,
                                      currentUserReviews, 
                                      setCurrentUserReviews,
                                      hasReviewedBusiness    
                                  }}
      >
        <div className="App">
          <Navigation logout={logout} />
          <AppRoutes login={login} signup={signup} />
        </div>
      </UserContext.Provider>                                
    </BrowserRouter>
  );
}


export default App;

