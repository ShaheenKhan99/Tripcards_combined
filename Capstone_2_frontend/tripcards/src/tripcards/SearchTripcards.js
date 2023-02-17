import { useState } from "react";
import { Container, Button } from "react-bootstrap";

import "./SearchTripcards.css";


/** SearchTripcards provides a form that a user can use to search for tripcards by username and/or city */

const SearchTripcards = (props)  => {
  const [city, setCity] = useState("");
  const [username, setUsername] = useState("");
  
  // sets state of the city on change
  const handleCityChange = e => setCity(e.target.value);


  // sets state of the user on change
  const handleUsernameChange = e => setUsername(e.target.value);

  // Pass current state when user submits search button
  const handleSearch = (e) => {
    e.preventDefault();

    // takes care of accidentally trying to search for just spaces
    props.searchDBForTripcards(city.trim() || undefined, username.trim() || undefined);
  };

  return (
          <Container className="SearchTripcards">
            <div className="SearchTripcards-fields">

              <input className="form-control form-control-md"
                      placeholder="Enter Username " 
                      onChange={handleUsernameChange} />

              <input className="form-control form-control-md"
                     placeholder="Enter city" 
                     onChange={handleCityChange} />
            </div>

            <div className="SearchTripcards-search">
              <Button variant="light"
                      size="sm" 
                      type="submit"
                      className="SearchTripcards-searchButton"
                      onClick={handleSearch} 
                      aria-label="SearchTripcards">
                Search
              </Button>
            </div>
          </Container>
  );
}

export default SearchTripcards;