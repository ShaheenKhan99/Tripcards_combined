import { useContext } from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";

import UserContext from "../auth/UserContext";
import { formatDate } from "../common/Helpers";
import "./TripcardCard.css";

 
/** Shows information about a tripcard
 * 
 * Is rendered by TripcardCardList to show a "card" for each tripcard. Card is a link to details about the tripcard on TripcardPage
 * 
 * TripcardList -> TripcardCardList -> TripcardCard -> TripcardPage
 */

function TripcardCard(tripcard) {

  console.debug("TripcardCard",
                 "id=", tripcard.id);

  const { currentUser } = useContext(UserContext);
  
  return (
            <Link className="TripcardCard-link" 
                  to={`/tripcards/${tripcard.id}`} 
                  type="CreateTripcard" 
                  key={tripcard.id} >

                {currentUser.id === tripcard.user_id ? 

                    <Card className="TripcardCard-card text-center">
                      <Card.Body className="TripcardCard-cardbody"
                               style={{ backgroundColor: "#5ab9ea"}}>
                  
                        <Card.Title className="TripcardCard-title">{tripcard.city} </Card.Title>

                          <Card.Text>{tripcard.state}{' '} {tripcard.country} </Card.Text>

                          <Card.Text >Username:<span className="TripcardCard-username mx-2">{tripcard.username}</span>   </Card.Text>  

                      </Card.Body> 
                      <Card.Footer style={{ color: "#450b45" }}>
                            Created: {formatDate(tripcard.created_on)}
                      </Card.Footer> 
                    </Card> 
                :         
                    <Card className="TripcardCard-card text-center">
                        <Card.Body className="TripcardCard-cardbody"
                                   style={{ backgroundColor: "#71588d" }}>
                  
                          <Card.Title className="TripcardCard-title">{tripcard.city} </Card.Title>

                          <Card.Text>{tripcard.state}{' '} {tripcard.country} </Card.Text>

                          <Card.Text >Username:<span className="TripcardCard-username mx-2">{tripcard.username}</span>   
                          </Card.Text>  

                        </Card.Body>  
                        <Card.Footer style={{ color: "#450b45" }}>Created: {formatDate(tripcard.created_on)}</Card.Footer> 
                    </Card> 
                }
            </Link>          
        );
  }

export default TripcardCard;