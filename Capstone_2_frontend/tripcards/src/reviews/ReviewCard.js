import { useContext } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button } from "react-bootstrap";
import StarRatings from "react-star-ratings";

import { formatDate } from "../common/Helpers";
import UserContext from "../auth/UserContext";
import "./ReviewCard.css";


/** Review Card 
 * 
 * Rendered by ReviewCardList to show information for each review.
 * 
 * Routes -> ReviewCardList -> ReviewCard
 *           BusinessPage -> ReviewCardList -> ReviewCard
 *           UserPage -> ReviewCardList -> ReviewCard
 */

const ReviewCard = ({ id, 
                      user_id, 
                      username, 
                      business_id, 
                      business_name, 
                      text, 
                      rating,
                      created_on, 
                      image_url, 
                       }) => {

  console.debug("ReviewCard", "id=", id, "business_id", business_id);

  const { currentUser } = useContext(UserContext);

  // JSX if currentUser is review owner
  if (currentUser.id == user_id) {
    return (
       <Card className="ReviewCard-card">
          <Row>
            <Col sm={9}>
              <Card.Body className="ReviewCard-body">
            
                <Card.Title className="card-title">Review for {business_name} {' '} <span className="ReviewCard-username"> by {username}</span></Card.Title>
                
                <StarRatings rating={Number(rating)}
                                      starRatedColor ="purple"
                                      numberOfStars={5}
                                      starDimension="1.3rem"
                                      starSpacing="0.1rem" />

                
                <Card.Text className="lh-1 mt-4">{text}</Card.Text>

                {image_url ?  
                  <Card.Link href={image_url} target="_blank">See photo</Card.Link>
                : 
                  null 
                }

                <Card.Text className="ReviewCard-date mt-2 text-muted">Reviewed on {formatDate(created_on)}</Card.Text>

              </Card.Body>   
            </Col>

            <Col sm={3}>
                <div className="p-3 mt-3 text-center">
                    <Link to={`/reviews/${id}/update`} 
                          type="UpdateReviewForm" 
                          className="text-center">
                      <Button variant="outline-dark" 
                              to={`/reviews/${id}/update`}>
                        Edit review
                      </Button>
                    </Link>
                </div>
            </Col>
          </Row>
      </Card>
    );
  }


  return (
          <Card className="ReviewCard-card"> 
            <Card.Body className="card-body">
              <Card.Title className="card-title">Review for {business_name} {' '} <span className="ReviewCard-username"> by {username}</span></Card.Title>
              
              <StarRatings rating={Number(rating)}
                            starRatedColor ="purple"
                            numberOfStars={5}
                            starDimension="1.3rem"
                            starSpacing="0.1rem" />
          
                <Card.Text className="lh-1 mt-5">{text}</Card.Text>
                
                <Card.Text className="text-muted lh-1">Created: {formatDate(created_on)}</Card.Text>

                {image_url ?
                  <Card.Link href={image_url} target="_blank">See photo</Card.Link>
                : 
                  null 
                }

            </Card.Body>   
          </Card>
    );
}

export default ReviewCard;
