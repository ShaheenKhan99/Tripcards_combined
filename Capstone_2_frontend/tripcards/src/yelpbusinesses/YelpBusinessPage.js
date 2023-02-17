import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";

import TripcardsApi from "../api/api";
import UserContext from "../auth/UserContext";
import { getCorrectBusiness } from "../common/BusinessHelpers";
import { fullDestination } from "../common/Helpers";
import CreateTripcardForm from "../tripcards/CreateTripcardForm";
import YelpBusinessReviews from "./YelpBusinessReviews";
import { getStars } from "../common/Helpers";
import FooterYelp from "../common/FooterYelp";
import LoadingSpinner from "../common/LoadingSpinner";
import noImage from "../assets/no_image.jpg";
import "./YelpBusinessPage.css";


/** YelpBusinessPage 
 * 
 * Shows detailed information about business and Yelp reviews fetched directly from Yelp API.
 * 
 * Checks whether business already exists in database otherwise adds it to the database and then adds the business to the user tripcard
 * 
 * Receives  addBusinessToTripcard  func props from parent, which is called on add button click. 
 * 
 * Checks if tripcard for the destination exists otherwise prompts user to first create a tripcard and then adds business to tripcard
 * 
 * Routed at api/businesses/:yelp_id
 * 
 * YelpBusinessesList -> BusinessCard  -> YelpBusinessPage -> CreateTripcard
 * YelpBusinessPage -> YelpBusinessReviews 
 * 
 */

const YelpBusinessPage = () => {
  const { yelp_id } = useParams();

  console.debug("YelpBusinessDetail", "yelp_id=", yelp_id);

  const { currentUser, 
          hasCreatedYelpDestinationTripcard,
          hasAddedYelpBusinessToTripcard,
          currentUserTripcards,
          setTripcard,
          addBusinessToTripcard
           } = useContext(UserContext);


  const [business, setBusiness] = useState();
  const [yelpReviews, setYelpReviews] = useState([]);
 
  const [tripcardBusiness, setTripcardBusiness] = useState();
  const [dbTripcard, setDBTripcard] = useState();

  const [added, setAdded] = useState();
  const [isCreate, setIsCreate] = useState();
  const [created, setCreated] = useState();
  const [show, setShow] = useState();
  const [buttonDisabled, setButtonDisabled] = useState(false);
                                   

  useEffect(function getYelpBusinessDetailsAndReviews(){
    async function getBusinessDetails() {
      setBusiness(await TripcardsApi.getBusinessDetails(yelp_id));
      setYelpReviews(await TripcardsApi.getYelpReviews(yelp_id));
      setCreated(await hasCreatedYelpDestinationTripcard(yelp_id));
      setAdded(await hasAddedYelpBusinessToTripcard(yelp_id)); 
    }
    getBusinessDetails();
  }, [yelp_id, hasAddedYelpBusinessToTripcard, hasCreatedYelpDestinationTripcard])


  if (!business) return <LoadingSpinner />;


  /** Handle createTripcard button to create tripcard for destination. Displays form to create a tripcard */

  async function handleCreateTripcardClick(evt){
    evt.preventDefault();

    setIsCreate(true);
  }


  /** Handle add business to tripcard click. 
   * 
   * Uses helper function getCorrectBusiness that checks if business, business destination and category are already in database. If not, the function adds the destination and category, and then the business to the database and returns  business to add to tripcard
   * 
   * Next, it checks if user has a tripcard already for the destination. If not, it prompts user to create a tripcard. It then adds the business to the tripcard
  */

  async function  handleAdd(evt){
    evt.preventDefault();
    
    // fetch business from DB 
    const tripcardBusiness = await getCorrectBusiness(business);
    setTripcardBusiness(tripcardBusiness);

     // Fetch user tripcard for current destination
     const tripcard = await getCorrectTripcard();
     setTripcard(tripcard);

    // add business to tripcard
    try {
      await addBusinessToTripcard(tripcard.id, tripcardBusiness.id)
        
      setAdded(true);
      setShow(true);
      setButtonDisabled(true);
    } catch (err) {
      console.error("Could not add business to tripcard", err.message);
      return { success: false, err };
    }  
  } 

    
  /** Get correct tripcard for user. If tripcard does not exist, wait to get created tripcard */
  
  async function getCorrectTripcard() {
    let dbTripcard = await getDBTripcardForUser();
    if (dbTripcard) {
      setDBTripcard(dbTripcard);  
      setCreated(true);
      return dbTripcard;
    }
  }

  /** Fetch tripcard from DB. If tripcard not created, it sets a tripcard error and prompts user to create a tripcard */

  function getDBTripcardForUser(){
    let tripcard = currentUserTripcards.find(tripcard => fullDestination (tripcard) == fullDestination(business));

    if (tripcard){
      return tripcard;
    } else {
      setIsCreate(true);
    }  
  }

  return (
          <div className="p-3">

            {created ?
              null
            :
              <Container className="YelpBusinessPage-createTripcard mb-4 p-4">
                <h5>Let's create a tripcard for {business.city}, {business.state}  {business.country}  first </h5> 

                <CreateTripcardForm   business={business}
                                      setIsCreate={isCreate}
                                      onClick={handleCreateTripcardClick}
                />

              </Container> 
            }  

            <div className="mt-4">
              <Container className="YelpBusinessPage-container py-1">      
                <Card className="YelpBusinessPage-card">
                  <Card.Body>                         
                     <Row className="YelpBusinessPage-row">
                        <Col sm={5}>

                          {business.image_url ? 
                            <Card.Link href={business.image_url} target="_blank">
                              <Card.Img variant="top" 
                                    src={business.image_url}
                                    alt=' '
                                    className="YelpBusinessPage-image"
                              />
                            </Card.Link>
                          : 
                            <Card.Img variant="top" 
                                        src={noImage}
                                        alt="No image available"
                                        className="YelpBusinessPage-image"
                            />
                          }
                        </Col>

                        <Col sm={4} className="YelpBusinessPage-info px-3">
                          <Card.Title className="YelpBusinessPage-title">
                          {business.business_name}
                          </Card.Title>

                          <Card.Text className="lh-1">{business.address1}</Card.Text>

                          <Card.Text className="lh-1 mb-4">{business.city}, {business.state}, {business.country} {business.zip_code}</Card.Text>

                          <Card.Text className="lh-1">Phone: {business.phone}</Card.Text>

                          <Card.Text className="lh-1">Category: {business.sub_category}</Card.Text> 

                          <Card.Text className="lh-1">{business.review_count} {' '} Yelp reviews</Card.Text>

                          <div className="YelpBusinessPage-starRating mb-2">
                            <img src={getStars(business)} alt="star rating" />
                          </div> 

                          <div className="mb-2">
                            <Card.Link href={business.url} 
                                   target="_blank">
                            See more on Yelp
                            </Card.Link>
                          </div>
                        </Col> 
                    
                        <Col sm={3} className="YelpBusinessPage-addButton text-center">
                      
                          {currentUser ? 
                            <>
                              {created ? 
                                null 
                              :
                                <CreateTripcardForm   business={business}
                                                      setIsCreate={isCreate}
                                                      onClick={handleCreateTripcardClick}
                                />
                              }
                            
                              {added ?    
                                <div className="py-5 text-center" >
                                  <Alert variant="success">
                                    <Alert.Link href="/">Saved!   Explore other places</Alert.Link> 
                                  </Alert>
                                </div>
                              : 
                                <div className="py-5 text-center">
                                  <Button variant="outline-success"
                                          size="md" 
                                          disabled={buttonDisabled}
                                          onClick={handleAdd}>
                                      Add
                                  </Button>
                                </div>
                              }                         
                            </>
                          : 
                            null
                          }
                 
                        </Col>   
                      </Row>
                    </Card.Body>  
                </Card>  
              </Container>
            </div>

            <Container className="mt-5">
              <h5 className="YelpBusinessePage-reviews text-center">Reviews from Yelp</h5>
              <YelpBusinessReviews reviews={yelpReviews} />
            </Container>
          <FooterYelp />
        </div>
  );
}

export default YelpBusinessPage;

