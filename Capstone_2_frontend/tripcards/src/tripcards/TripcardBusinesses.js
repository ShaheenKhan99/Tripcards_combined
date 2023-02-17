import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import BusinessCard from "../businesses/BusinessCard";


/** Shows limited information about a business saved on a tripcard
 * 
 * Is rendered by TripcardPage to show a "card" for each business.
 * 
 * TripcardPage -> TripcardBusinesses
 * 
 */

const TripcardBusinesses = ({ businesses }) => {

  return (
          <Container className="mt-4">
            <Row className="BusinessList-row row-flex gy-4">
              
              {businesses.map(business => (
                
                <Col xs={6} md={4} className="YelpBusiness-col">

                  <Link className="tripcardBusinessCard-card" 
                        to={`/businesses/${business.id}`}
                        key={business.id}
                        id={business.id}
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
                                  review_count={business.yelpreview_count}
                                  category_name={business.category_name}
                                  category_id={business.category_id}
                                  destination_id={business.destination_id}
                      /> 
                  </Link>

                </Col> 
              ))}
            </Row>
          </Container>
    );
}

export default TripcardBusinesses;

