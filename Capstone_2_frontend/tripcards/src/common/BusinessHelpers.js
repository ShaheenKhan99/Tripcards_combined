import TripcardsApi from '../api/api';
import { getCorrectDestination } from "./DestinationHelper";


/** Helper function to fetch correct business from DB or wait to add business to DB and then fetch 
 * 
 * Checks if business, business destination and category are already in database. If not, it adds the destination and category, and then the business to the database. 
 * 
*/

export const getCorrectBusiness = async (business) => {

  let dbBusiness;
  let result = await getDBBusinessForUser();

  if (result){
    dbBusiness = result;
  } else {
    dbBusiness = await addYelpBusinessToDB();    
  }
  return dbBusiness;


  /** Fetch business from DB */

  async function getDBBusinessForUser(){

    try {
      let resultRes = await TripcardsApi.getBusinesses(business.city, business.yelp_id);
      let result = resultRes[0];
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  
  /** Get correct category from DB. If category does not exist, wait to get created category and return category */

  async function getCorrectCategory(){
    let dbCategory;
    let result = await getDBCategoryForUser();

    if(result) {
      dbCategory = result;
    } else {
      dbCategory = await addCategoryToDB();     
    }
    return dbCategory;   
  }


  /** Fetch category from DB if it exists */
  async function getDBCategoryForUser(){
    let category_name = business.sub_category;
      try {
        let resultRes = await TripcardsApi.getCategories(category_name);
        let result = resultRes[0];
        return result;
      } catch (err) {
        console.error(err);
      }
  }


  /** Add category from Yelp business to DB if category does not exist */

  async function addCategoryToDB() {
    let category_name = business.sub_category;
    try {
      const response = await TripcardsApi.createCategory(category_name);
      return response;
    } catch (err) {
      console.error(err.message)
    }  
  }


  /** Fetch correct destination and category for Yelp business and then add Yelp Business to DB*/ 

  async function addYelpBusinessToDB() {

    const destination = await getCorrectDestination(business);
    
    const category = await getCorrectCategory();

          let data = {
            yelp_id: business.yelp_id,
            business_name: business.business_name,
            address1: business.address1,
            address2:business.address2,
            city:business.city,
            state:business.state,
            country:business.country,
            zip_code:business.zip_code,
            latitude:business.latitude,
            longitude:business.longitude,
            phone:business.phone,
            image_url:business.image_url,
            url:business.url,
            rating:business.rating,
            yelpReview_count:business.review_count,
            category_name:business.sub_category,
            destination_id: destination.id,
            category_id: category.id
          }
        
      try {
        const response = await TripcardsApi.addBusinessToDB(data);
        return response;
      } catch (err) {
        console.error(err.message)
        return { success: false, err};
      }  
    }

}

  

  


