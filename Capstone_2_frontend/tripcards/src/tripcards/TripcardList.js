import { useEffect, useContext } from "react";
import { Container } from "react-bootstrap";

import TripcardsApi from "../api/api";
import SearchTripcards from "./SearchTripcards";
import TripcardCardList from './TripcardCardList';
import FooterMain from "../common/FooterMain";
import LoadingSpinner from "../common/LoadingSpinner";
import UserContext from "../auth/UserContext";


/** Shows list of tripcards that are not private
 * 
 * On mount, loads tripcards from API.
 * Re-loads filtered tripcards on submit from search form.
 * 
 * TripcardList -> TripcardCardList -> TripcardCard
 * 
 * This is routed to at /tripcards
 */

const TripcardList = () => {
  console.debug("TripcardList");

  const { tripcards, setTripcards, currentUser } = useContext(UserContext);
 
  useEffect(function getAllTripcardsOnMount() {
    console.debug("TripcardList useEffect getAllTripcardsOnMount");
    searchDBForTripcards();
  }, []);
    

  /** Triggered by search form submit, reloads tripcards */

  async function searchDBForTripcards(city, username) {
    try {
      let allTripcards = await TripcardsApi.getTripcardsByCityAndUsername(city, username); 
      let filteredTripcards = allTripcards.filter((tripcard) => tripcard.keep_private == false || tripcard.user_id == currentUser.id);
      setTripcards(filteredTripcards);
    } catch (errors) {
      console.error("There are no tripcards", errors);
    }  
  }

  if (!tripcards) return  <LoadingSpinner />


  return (
      <> 
        <Container> 
            <h5 className="text-center py-3" style={{ color: '#450b45' }}>Search for tripcards by username or city</h5>   
            <SearchTripcards searchDBForTripcards={searchDBForTripcards} />
        </Container>


        <div className="TripcardList justify-content-center py-4">
              {tripcards.length ?     
                <TripcardCardList tripcards={tripcards} />
              : 
                <div className="text-center" style={{ color: '#450b45' }}>  
                  <h5 className="text-center py-3">No tripcards yet</h5>
                </div>
              }
        </div>
      <FooterMain />
    </>
  );
}

export default TripcardList;

