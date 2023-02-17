import { useState } from "react";
import { Container, Button } from "react-bootstrap";
import "./SearchDBBusinesses.css";


/** SearchDBBusinesses provides a form that a user can use to search for user saved businesses in the database by category and city. 
 * 
 * Is rendered by BusinessList 
 * 
 * BusinessList -> SearchDBBusinesses
 * 
*/

const SearchDBBusinesses = (props)  => {
  const [category_name, setCategoryName] = useState("");
  const [city, setCity] = useState("");
  

  // sets state of the category on change
  const handleCategoryNameChange = e => setCategoryName(e.target.value);

  // sets state of the city on change
  const handleCityChange = e => setCity(e.target.value);

  
  // Pass current state when user submits search button
  const handleSearch = (e) => {
    e.preventDefault();

    
    // take care of accidentally trying to search for just spaces
    props.searchDB(category_name.trim() || undefined, city.trim() || undefined);
  };

  return (
          <Container className="SearchDBBusinesses">
            <div className="SearchDBBusinesses-fields mt-3">
              <input className="form-control form-control-md"
                      placeholder="Enter a category" 
                      onChange={handleCategoryNameChange}/>

              <input placeholder="Enter a city" 
                   onChange={handleCityChange} />
            </div>

            <div className="SearchDBBusinesses-search">
              <Button variant="light"
                      size="sm" 
                      type="submit"
                      className="SearchDBBusinesses-searchButton"
                      onClick={handleSearch} 
                      aria-label="SearchDBBusinesses">
                Search
              </Button>
            </div>
          </Container>
  );
}

export default SearchDBBusinesses;