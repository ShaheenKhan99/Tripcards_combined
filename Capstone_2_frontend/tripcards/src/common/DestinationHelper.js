import TripcardsApi from '../api/api';

/** Get correct destination from DB. If destination does not exist, wait to get created destination and  then return destination */

export const getCorrectDestination = async (business) => {

  let dbDestination;
  let result = await getDBDestinationForUser();

  if(result) {
    dbDestination = result;
  } else {
    dbDestination = await addDestinationToDB();   
  }

  return dbDestination;   

  /**  Fetch destination from DB */

  async function getDBDestinationForUser() {
    
    let city = business.city;
    let state = business.state;
    let country = business.country;

    try {
      let resultRes = await TripcardsApi.getDestinations(city, state, country);
      let result = resultRes[0];
      return result;
    } catch (err) {
      console.error(err);
      return;
    }
  }

  /** Add destination of Yelp business to DB  */

  async function addDestinationToDB() {
    let data = {
        city: business.city, 
        state: business.state,
        country: business.country
      }

    try {
      const response = await TripcardsApi.createDestination(data);
      return response;
    } catch (error) {
      console.error(error.message)
      return { success: false, error};
    }  
   }
}
