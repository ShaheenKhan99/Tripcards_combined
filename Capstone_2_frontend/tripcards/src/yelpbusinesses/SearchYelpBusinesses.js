import { useState } from "react";
import { Container, Button } from "react-bootstrap";

import "./SearchYelpBusinesses.css";


/** SearchYelpBusinesses provides a form that a user can use to search for businesses sourced by YelpApi. 
 * 
 * It is rendered by the homepage
*/

const SearchYelpBusinesses = (props) => {
  const [term, setTerm] = useState("");
  const [location, setLocation] = useState("");
  
  // sets state of the term on change
  const handleTermChange = e => setTerm(e.target.value);

  // sets state of the location on change
  const handleLocationChange = e => setLocation(e.target.value);

  // Pass current state when user submits search button
  const handleSearch = (e) => {
    e.preventDefault();
    props.searchYelp(term, location);
  };

  
  return (
        <Container className="SearchYelpBusinesses">

          <div className="SearchYelpBusinesses-fields text-center">
            <input className="form-control form-control-md"
                    placeholder="Restaurants, museums ..." 
                    onChange={handleTermChange} />

            <input  className="form-control form-control-md"
                    placeholder="Enter a city" 
                    onChange={handleLocationChange} />
          </div>

          <div className="SearchYelpBusinesses-search text-center">
            <Button variant="light"
                    type="submit"
                    className="SearchyelpBusinesses-searchButton"
                    onClick={handleSearch} 
                    aria-label="SearchYelpBusinesses">
                  Search
            </Button>
          </div>
        </Container>
  );
}

export default SearchYelpBusinesses;