import { useState } from "react";

import TripcardsApi from "../api/api";
import YelpBusinessesList from "../yelpbusinesses/YelpBusinessesList";
import SearchYelpBusinesses from "../yelpbusinesses/SearchYelpBusinesses";
import LearnMoreModal from "./LearnMoreModal";
import Alert from "../common/Alert";
import useTimedMessage from "../hooks/useTimedMessage";
import FooterMain from "../common/FooterMain";
import "./Homepage.css";


/** Homepage of site.
 * 
 * Renders LearnMoreModal that  provides information about "tripcards"
 * 
 * Searches for businesses on Yelp from this page. Does not require any login
 * 
 * Routes -> Homepage -> LearnMoreModal
 * 
 */

const Homepage = () => {

  const [businesses, setBusinesses] = useState([]);

  // switch to use limited-time-display message hook
  const [show, setShow] = useTimedMessage();

  const searchYelp = async (term, location) => {

    try {
      let businesses = await TripcardsApi.getBusinessesFromYelpApi(term, location); 
      setBusinesses(businesses);
    } catch (err) {
      console.error(err.message);
      setShow(true);
    }    
  }


  return (
        <>
          <div className="Homepage mt-4">
            <div className="Homepage-headingDiv text-center p-3">
              <h5 className="mb-3">Explore and save favorite places at dream destinations on your tripcards!</h5>
              <LearnMoreModal />
            </div>

      
              <SearchYelpBusinesses searchYelp={searchYelp} />
              <YelpBusinessesList businesses={businesses} />

              {show ?
                <Alert type="danger"
                messages={["Could not find any places for this destination. Please try another destination"]} />
              : 
                null }

              <FooterMain />
    
          </div>      
        </>
      );
}

export default Homepage;