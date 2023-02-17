import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import BusinessCard from '../businesses/BusinessCard';


/** Shows list of businesses returned from Yelp API through searchYelpBusinesses.
 * 
 * YelpBusinessesList -> BusinessCard
 * This is routed to at /
 * Renders BusinessCard
 * 
 * YelpBusinessesList -> BusinessCard
 */


const YelpBusinessesList = ({ businesses }) => {

  return (
        <Container className="YelpBusinessesList-container mt-4" style={{ height: "100%" }}>
              <Row className="YelpBusinessesList-row row-flex gy-3">

                {businesses.map(business => (
                  <Col xs={6} md={4} className="YelpBusiness-col">

                    <Link className="YelpBusiness-Link" 
                          to={`api/businesses/${business.yelp_id}`}
                          style={{ textDecoration: "none" }}>
                      <BusinessCard key={business.yelp_id}
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
                                    review_count={business.review_count}
                                    category={business.category}
                      />
                    </Link>
                  </Col>
                ))}
              </Row>
     
      </Container>
    );
};

export default YelpBusinessesList;