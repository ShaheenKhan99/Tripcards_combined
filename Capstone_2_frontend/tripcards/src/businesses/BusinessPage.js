import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Alert, Container, Row, Col, Card, Button } from "react-bootstrap"; 

import UserContext from "../auth/UserContext";
import TripcardsApi from "../api/api";
import CreateTripcardForm from "../tripcards/CreateTripcardForm";
import ReviewCardList from "../reviews/ReviewCardList";
import AddReviewForm from "../reviews/AddReviewForm";
import { getStars, getAverageRating } from "../common/Helpers";
import useToggle from "../hooks/useToggle";
import LoadingSpinner from "../common/LoadingSpinner";
import FooterYelp from "../common/FooterYelp"
import noImage from "../assets/no_image.jpg";
import StarRatings from "react-star-ratings";
import "./BusinessPage.css";


/** Business Details page
 * 
 * Is rendered by BusinessList to show information about business saved in DB and reviews written by 'Tripcards' users.
 * 
 * Receives add and delete func props from parent, which are called on  add or delete.
 * 
 * Checks if user has a tripcard for the business location. If not, user is prompted to create a tripcard and then adds the business to the tripcard
 * 
 * Displays addReview form when button is clicked so that a user can write a review 
 * 
 * Routed at /businesses/:id
 * 
 * Routes: { BusinessCard, ReviewCardList }
 * 
 * Route: BusinessList -> BusinessCard -> BusinessPage -> CreateTripcard
 * 
 * Route: BusinessList -> BusinessCard -> BusinessPage -> AddReview
 * 
 * Route: BusinessList -> BusinessCard -> BusinessPage -> ReviewCardList
 * 
 */

 const BusinessPage = ( addReview ) => {
    const { id } = useParams();

    console.debug("BusinessDetail", "id=", id);

    const { hasAddedTripcardBusiness,
            setTripcard,
            hasCreatedDestinationTripcard,
            currentUserTripcards,
            addBusinessToTripcard,
            deleteBusinessFromTripcard,
            hasReviewedBusiness } = useContext(UserContext);

    
    const [business, setBusiness] = useState(null);
    const [dbTripcard, setDBTripcard] = useState();
    const [deleteTripcardBusiness, setDeleteTripcardBusiness] = useState();
    const [isAddReview, setIsAddReview] = useToggle(false);

    const [isCreate, setIsCreate] = useState();
    const [added, setAdded] = useState();
    const [created, setCreated] = useState();
    const [reviewed, setReviewed] = useState();
    const [show, setShow] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [deleted, setDeleted] = useState(false);

   
    useEffect(function getBusinessAndReviewsForUser() {
      async function getBusiness() {
        setBusiness(await TripcardsApi.getBusiness(id));
        setCreated(await hasCreatedDestinationTripcard(id));
        setAdded(await hasAddedTripcardBusiness(id));
        setReviewed(await hasReviewedBusiness(id));
      }
     getBusiness();
    }, [id, hasAddedTripcardBusiness, hasCreatedDestinationTripcard, hasReviewedBusiness]);


    if (!business) return <LoadingSpinner />;


  /** Handle AddReview button to write review for business */

  async function handleAddReviewClick(evt){
    evt.preventDefault();

    setIsAddReview(true);
  }


  /** Handle createTripcard button to create tripcard for destination. Displays form to create a tripcard */

  async function handleCreateTripcardClick(evt){
    evt.preventDefault();

    setIsCreate(true);
  }


  /** Handle add business to tripcard click. 
   * Checks if user has a tripcard already for the destination. 
   * If not, it  prompts user to create a tripcard. 
   * It then adds the business to the tripcard
  */

  async function handleAdd(evt) {
    evt.preventDefault();

    // Fetch user tripcard for current destination
    const tripcard = await getCorrectTripcard();
    setTripcard(tripcard);
      
    try {
          await addBusinessToTripcard(tripcard.id, business.id);
          setShow(true);
          setAdded(true);
          setButtonDisabled(true);
          } catch (err) {
            console.error("Could not add business to tripcard", err.message);
            return { success: false, err};
          }   
  }
 
  /** Get correct tripcard for user. If tripcard does not exist, wait to get created tripcard */
  
  async function getCorrectTripcard() {
    let dbTripcard = await getDBTripcardForUser();
    if (dbTripcard) {
        setDBTripcard(dbTripcard);   
        setCreated(true); 
        setShow(true); 
        return dbTripcard;
    } else {
      setIsCreate(true);
    }
  }


  /** Fetch tripcard from DB. If tripcard not created, it  prompts user to create a tripcard */

  function getDBTripcardForUser(){
   
    let tripcard = currentUserTripcards.find(tripcard => tripcard.destination_id == business.destination_id);
    if (tripcard) {
      return tripcard;
    } else {
      setIsCreate(true);  
    }  
  }


  /** Handle remove business from tripcard */

  async function handleRemove(evt) {
    evt.preventDefault();

    const tripcard = getDBTripcardForUser();
    setTripcard(tripcard);

    setDeleteTripcardBusiness(await deleteBusinessFromTripcard(tripcard.id, id));
    setAdded(false);
    setShow(false);
    setDeleted(true); 
  }

  return (
      <>
        <div className="p-3">
          {created ?
            null   
          :
            <Container className="YelpBusinessPage-createTripcard mb-4 p-4">
              <h5>Let's create a tripcard for {business.city} first </h5> 

                <CreateTripcardForm   business={business}
                                      setIsCreate={isCreate}
                                      onClick={handleCreateTripcardClick}
                />

            </Container>
          } 
        

            <Container className="BusinessPage-detailsContainer py-1">
                
              {show ?
                  <Alert variant="success">
                      <Alert.Link href="/">Added!{' '}   Explore other places</Alert.Link> 
                  </Alert>
              :
                null 
              }     
            
                <Card className="BusinessPage-card p-4"> 
                
                  <Row className="BusinessPage-row">
                      <Col sm={5}>
                        {business.image_url ? 
                          <Card.Img src={business.image_url} 
                                alt='...' 
                                variant="top"
                                className="BusinessPage-image" />
                        :
                          <Card.Img className="BusinessPage-image" 
                                    src={noImage} 
                                    alt='No image available' />
                         
                        }
                      </Col>

                      <Col sm={4}>
                        <Card.Title className="mt-4">{business.business_name}</Card.Title>
                          <Card.Text className="lh-1">{business.address1}</Card.Text>
                          <Card.Text className="lh-1">{business.city}, {business.state} {business.country}</Card.Text>

                          <Card.Text className="lh-1 mb-4">{business.zip_code}</Card.Text>
            
                          {business.phone ?
                             <Card.Text className="lh-1 mb-4">Phone:  {business.phone}</Card.Text>
                          : 
                            null
                          }

                          <Card.Text className="BusinessPage-categoryName lh-1">Category: {business.category_name}</Card.Text>

            
                          <div className="mb-2 mt-5">
                            <img src={getStars(business)} alt="star rating" />
                          </div> 
            
                          <Card.Text className="lh-1">{business.yelpReview_count}{' '}Yelp reviews</Card.Text>    
     
                          <div className="mb-4">
                            <Card.Link  href={business.url} 
                                      target="_blank">
                             See more on Yelp
                            </Card.Link> 
                          </div> 
                      </Col>

                      <Col sm={3} className="text-center">

                    {created ? 
                      null 
                    :
                      <CreateTripcardForm   business={business}
                                            setIsCreate={isCreate}
                                            onClick={handleCreateTripcardClick}
                      />
                    }

                    {added ?
                      <div className="py-5">
                        <Button variant="outline-danger" 
                                onClick={handleRemove}>
                          Delete
                        </Button>
                      </div> 
                    : 
                      <div className="py-5 ">
                        <Button variant="success"
                                size="md"
                                disabled={buttonDisabled}
                                onClick={handleAdd}>
                              Add
                        </Button>
                      </div>
                    }  
            

                    {reviewed ?
                      null
                    :
                      <div className="py-3">
                        <Button variant="outline-secondary" 
                                onClick={handleAddReviewClick}>
                          Write a review
                        </Button>
                      </div>
                    }

                    {business.reviews.length ?
                      <div className="mb-5">
                        <StarRatings rating={getAverageRating(business)}
                                      starRatedColor ="purple"
                                      numberOfStars={5}
                                      starDimension="1.3rem"
                                      starSpacing="0.1rem" />

                          {business.reviews.length == 1  ?  
                            <Card.Text className="lh-1 mt-3">{business.reviews.length}{' '}Tripcards review</Card.Text> 
                          :
                            <Card.Text className="lh-1 mt-3">{business.reviews.length}{' '}Tripcards reviews</Card.Text>   
                          }
                      </div>
                    :
                      <div className="mt-5">
                        <p>No Tripcards reviews</p>
                      </div>
                    }

                    
                  </Col>  
                </Row>     
                                  
              </Card>               
            </Container>           

            <div className="AddReview-container mt-2 mb-5">
              {isAddReview ? <AddReviewForm  key={id}
                                              id={id}
                                              addReview={addReview}
                                              setIsAddReview={setIsAddReview}
                                              business={business}
                              /> 
              : 
                null 
              }
            </div>
        
            <Container className="Reviews-card container mt-5">
                {business.reviews.length ? 
                    ( 
                      <>
                        <h5 className="text-center" style={{ 'color': '#450b45' }}>Tripcards user reviews for {business.business_name}</h5>
                        <div className="BusinessReviews-list">
                          <ReviewCardList reviews={business.reviews} />
                        </div> 
                      </>
                    )
                : 
                  <div className="mt-5">
                    <h5 className="text-center mt-5" style={{ 'color': '#450b45' }}>No Tripcards user reviews yet!</h5>
                  </div>
                }
          </Container>
      </div>
      <FooterYelp />
    </>
  );
  
}

export default BusinessPage;
