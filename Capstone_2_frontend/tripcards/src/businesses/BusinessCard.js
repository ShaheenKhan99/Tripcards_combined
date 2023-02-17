import { Card } from "react-bootstrap";

import { getStars } from "../common/Helpers";
import noImage from "../assets/no_image.jpg";
import "./BusinessCard.css";


/** Shows limited information about a business returned from Yelp API or database
 * 
 * Is rendered by YelpBusinessesList or Business List to show a "card" for each business.
 * 
 * Card is a link to YelpBusinessPage or BusinessPage
 * 
 * YelpBusinessesList -> BusinessCard -> YelpBusinessPage
 * 
 * BusinessList -> BusinessCard -> BusinessPage
 * 
 */


const BusinessCard = (business) => {
  console.debug("business:", business)

  return (
          <>
            <Card className="BusinessCard-card h-100">

              {business.image_url ? 

                <Card.Img src={business.image_url}
                          position='top' 
                          alt='...' 
                          className="BusinessCard-image"
                       />
              :
                <Card.Img className="BusinessCard-image" 
                          src={noImage} 
                          alt=' No image available' />
              }
                <Card.Body className="p-4">
                  <Card.Title>{business.business_name}</Card.Title>
                  
                  <Card.Text className="BusinessCard-destination mt-3 lh-1">{business.city}  {business.state} </Card.Text>  
                 
                {business.category_name ?
                  <Card.Text className="BusinessCard-category mt-4 lh-1">Category: {business.category_name}</Card.Text>
                :
                  null }

                  <Card.Text className="lh-1">{business.review_count} Yelp reviews</Card.Text>
                
                  <div className="stars-rating">
                    <img 
                        className="star-rating" 
                        src={getStars(business)}
                        alt="star-rating"
                    />
                  </div>
                  
                </Card.Body>
              </Card>
          </>    
        );
  }

export default BusinessCard;