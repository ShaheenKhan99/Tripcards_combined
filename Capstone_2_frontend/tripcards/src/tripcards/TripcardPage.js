import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";

import TripcardsApi from "../api/api";
import UserContext from "../auth/UserContext";
import TripcardBusinesses from "./TripcardBusinesses";
import UpdateTripcardForm from "./UpdateTripcardForm";
import useToggle from "../hooks/useToggle";
import { formatDate } from '../common/Helpers';
import FooterYelp from "../common/FooterYelp";
import LoadingSpinner from "../common/LoadingSpinner";
import "./TripcardPage.css";


/** TripcardPage 
 * 
 * Renders information about tripcard including businesses saved on tripcard.
 * 
 * Renders updateTripcard Form to edit tripcard or a button to delete the tripcard if currentUser is tripcard owner
 * 
 * Routed at /tripcards/:id
 * 
 * Routes -> TripcardCard -> TripcardPage
 */

const TripcardPage = ( updateTripcard ) => {

  const { id } = useParams();

  const { currentUser, removeTripcard } = useContext(UserContext);

  const [tripcard, setTripcard] = useState();
  const [businesses, setBusinesses] = useState([]);

  const [isUpdate, setIsUpdate] = useToggle(false);
  const [deleteTripcard, setDeleteTripcard] = useState()
  const [deleted, setDeleted] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);


  useEffect(function getTripcardAndBusinessesForUser() {
    async function getTripcard() {
      setTripcard(await TripcardsApi.getTripcard(id));
      setBusinesses(await TripcardsApi.getTripcardBusinesses(id));
    }
    getTripcard();
  }, [id]);

  if (!tripcard) return <LoadingSpinner />;


  /** Handles updateTripcard click - renders form to update tripcard */

  async function handleUpdateClick(evt){
    evt.preventDefault();
    setIsUpdate(true);
  } 

  /** Handles deleteTripcard click */

  async function handleDeleteClick(evt) {
    evt.preventDefault()
    setDeleteTripcard(await removeTripcard(evt, id));
    setButtonDisabled(true);
    setDeleted(true);
  }

  return (
      <div>
          <Container className="container p-4" style={{ height: '25%' }}>
                <Card className="TripcardPage-card">
                  <Card.Body className="TripcardPage-cardbody text-center">
                    <Row>
                      <div className="TripcardPage-deletedAlert mb-2">
                        {deleted ? 
                          <Alert variant="danger">
                            <Alert.Link href="/"> Deleted!    Explore other places</Alert.Link> 
                          </Alert>
                        : 
                          null 
                        } 
                        </div>

                        <Col sm={3}>
                          <CgProfile color="white"
                                     className="UserProfileIcon mt-3" />
                            <Card.Text className="UserProfile-username mt-3">
                            {tripcard.username} 
                            </Card.Text>
                          
                        </Col>
                        <Col sm={5}>
                          <Card.Title className="mt-1 mb-2">Tripcard for {tripcard.city}  </Card.Title>
                            <Card.Subtitle>
                            {tripcard.state}  {tripcard.country}
                            </Card.Subtitle>
                            <Card.Text className="mt-4 mb-4">Created on: {formatDate(tripcard.created_on)}</Card.Text>
                        </Col>

                        <Col sm={3}>
                          
                          {currentUser.id == tripcard.user_id ? 
                            <>
                              <div className="pb-2 mb-4">
                                <Button variant="outline-light" 
                                        onClick={handleUpdateClick}>
                                    Edit
                                </Button>
                              </div>

                              <div className="pb-2 mb-4">
                                <Button variant="outline-light" 
                                        disabled={buttonDisabled}
                                        onClick={handleDeleteClick}>
                                    Delete
                                </Button>
                              </div>
                          
                            </>
                          : 
                            null 
                          }
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
          </Container>

          <div className="updateTripcardForm">
            {isUpdate ? <UpdateTripcardForm key={id}
                                            id={id}
                                            updateTripcard={updateTripcard}
                                            setIsUpdate={setIsUpdate}
                                            tripcard={tripcard}
                        /> 
            : 
              null 
            }
          </div>

      
          <Container className="TripcardBusinesses-section p-4">
            <h5 className="text-center">Saved places</h5> 
              {tripcard.tripcardBusinesses.length ? 
               
                <TripcardBusinesses businesses={businesses}
                />
              : 
                <Link to="/"
                      style={{ textDecoration: "none" }} >
                  <Card className="p-4"
                        style={{ backgroundColor: "#8860D0", 
                                 color: "white",
                                 width: "15rem",
                                 margin: "auto" }}>
                    <h5 className="text-center">No favorites saved yet. Click here and save some </h5>
                  </Card>
                </Link>
              }
        </Container>
        <FooterYelp />
      </div>
  );
}

export default TripcardPage;