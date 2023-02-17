import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Card, Row, Col } from "react-bootstrap";

import SearchDBBusinesses from "./SearchDBBusinesses";
import BusinessCard from "./BusinessCard";
import FooterMain from "../common/FooterMain"
import LoadingSpinner from "../common/LoadingSpinner";
import TripcardsApi from "../api/api";


/** Shows list of businesses in database saved by users.
 * 
 * On mount, loads businesses from the database, 
 * 
 * reloads filtered businesses on submit from search form
 * 
 * This is routed to at /businesses
 * 
 * BusinessList -> BusinessCard-> BusinessPage
 */


const BusinessList = () => {
  
    const [businesses, setBusinesses] = useState(null);
    
    useEffect(function getBusinessesOnMount() {
    searchDB();
    }, []);
  

    /** Triggered by search form submit; reloads businesses */

    async function searchDB(category_name, city) {
      try {
        let businesses = await TripcardsApi.getBusinessesByCategoryAndDestination(category_name, city);
        setBusinesses(businesses);
       } catch (err) {
        console.error("There are no businesses saved by users", err);
       }  
    }
  
    if (!businesses) return  <LoadingSpinner />;

    
    return (
        <>  
          <Container className="BusinessList"> 
            <h5 className="text-center py-3" style={{ 'color': '#450b45' }}>Check out places saved by other users or write a review </h5>   
            <SearchDBBusinesses searchDB={searchDB} />
          </Container>

          <Container className="py-4" style={{ height: "100%" }}>
            {businesses.length ? (
              <Row className="BusinessList-row gy-4">
                {businesses.map((business) => (
                  <Col xs={12} md={4} className="BusinessList-col">

                    <Link className="BusinessCard-card" 
                          to={`/businesses/${business.id}`}
                          style={{ textDecoration: "none" }}>
                        <BusinessCard key={business.id}
                                  id={business.id}
                                  yelp_id={business.yelp_id}
                                  business_name={business.business_name}
                                  address1={business.address1}
                                  address2={business.address2}
                                  city={business.city}
                                  state={business.state}
                                  country={business.country}
                                  zip_code={business.zip_code}
                                  latitude={business.latitude}
                                  longitude={business.longitude}
                                  phone={business.phone}
                                  image_url={business.image_url}
                                  url={business.url}
                                  rating={business.rating}
                                  review_count={business.yelpReview_count}
                                  category_name={business.category_name}
                                  category_id={business.category_id}
                                  destination_id={business.destination_id}
                      /> 
                      </Link>
                    </Col>
                ))}
                </Row>)
              :
                <Link to="/"
                      style={{ textDecoration: "none" }} >
                  <Card className="p-4"
                        style={{ backgroundColor: "#8860D0", 
                                 color: "white",
                                 width: "18rem",
                                 margin: "auto" }}>
                    <h5 className="text-center">No favorites saved yet. Click here and save some </h5>
                  </Card>
                </Link>
              }
              
          </Container>
          <FooterMain />
      </>
  );
}

export default BusinessList;