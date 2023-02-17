import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { Container, Col, Row, Card, Button } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";

import UserContext from './UserContext';
import "./UserProfile.css";


/** UserProfile displays information/stats about the user
 * 
 * The user can click a button which leads them to update or delete their own profile here
 * 
 * UserPage -> UserProfile -> UpdateProfileForm 
 * 
*/


const UserProfile = () => {

  const { currentUser, 
          currentUserTripcards,  
          currentUserReviews 
           } = useContext(UserContext);


  return (
        <div className="py-3">
          <Container className="UserProfile-container">
                <Card className="UserProfile-card">
                  <Card.Body className="UserProfileCardBody text-center">
                    <Row className="justify-content-center align-items-center">
                      
                      <Col md={3} className="mt-3">
                        <CgProfile color="white"
                                   className="UserProfileIcon" />

                        <Card.Text className="UserProfile-Username mt-3 mb-4">{`${currentUser.username}`}</Card.Text>
                          <div className="pb-2 mb-2">
                            <Link to="/update" type="ProfileForm" className="text-center">
                              <Button variant="outline-light"
                                      size="sm" 
                                      to="/update">
                                  Edit profile
                              </Button>
                            </Link>
                          </div>
                      </Col>

                      <Col md={5}>
                        <div className="UserProfile-bio mt-3">
                          {currentUser.bio ? 
                            <Card.Text className="mb-1">{`${currentUser.bio}`}</Card.Text>
                          :
                            <Card.Text className="mb-1">No bio </Card.Text>
                          }
                        </div>
                      </Col>

                      <Col md={4}>
                      <div className="UserProfile-stats mt-3" >
                        <div className="d-flex justify-content-center">
                         
                          <div className="mx-3">
                            <Card.Text className="mb-1 h5">{currentUserTripcards.length}</Card.Text>
                            <Card.Text className="small mb-0">Tripcards</Card.Text>
                          </div>

                          <div className="px-3">
                            <Card.Text className="mb-1 h5">{currentUserReviews.length}</Card.Text>
                            <Card.Text className="small mb-0">Reviews</Card.Text>
                          </div>

                        </div>
                      </div>
                    </Col>                  
                </Row>
              </Card.Body>
            </Card>
      </Container>
    </div>
  );
}

export default UserProfile;

   

                
                
            
                  
                