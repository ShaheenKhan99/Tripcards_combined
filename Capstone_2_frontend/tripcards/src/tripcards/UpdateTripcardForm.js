import { useState, useContext } from "react";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

import { formatDate } from "../common/Helpers";
import TripcardsApi from "../api/api";
import UserContext from "../auth/UserContext";


/** Tripcard update form.
 * 
 * Displays updateTripcard form and handles changes to state on changes.
 * On submission:
 * - calls updateTripcard function prop
 * 
 * Routed as /tripcards/:id/update
 * 
 * Routes -> TripcardPage -> UpdateTripcardForm -> Alert
 */

const UpdateTripcardForm = ({ tripcard }) => {
  
  const { setTripcard } = useContext(UserContext);

  const [formData, setFormData] = useState({
                                            keep_private: tripcard.keep_private,
                                            has_visited: tripcard.has_visited
                                          });

  const [formErrors, setFormErrors] = useState([]);
    
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [saved, setSaved] = useState();
  
 
  /** Handle update tripcard form submit:
   * on form submit:
   * - attempt save to backend and report any errors
   * - if successful:
   * - clear previous error messages
   * - show save alert message
   * - set updated tripcard information throughout the site
   */

  async function handleSubmit(evt) {
    evt.preventDefault();

    let tripcardData = {
          keep_private: formData.keep_private,
          has_visited: formData.has_visited
    }

    let updatedTripcard;

    try {
      updatedTripcard = await TripcardsApi.updateTripcard(tripcard.id, tripcardData); 
    } catch(errors) {
      setFormErrors(errors);
      return { success: false, errors};
    }
  
    setFormData(data => ({ ...data }));
    setFormErrors([]);
    setSaved(true)
    setButtonDisabled(true); 

    // trigger reloading of tripcard information throughout the site
    setTripcard(updatedTripcard);
  } 


  /** Handle form data changing */

  const  handleChange = (evt) => {
    const { value, checked } = evt.target;
    
    setFormData(data => ({ ...data, [value]: checked }));
    setFormErrors([]);
  }
 
  return (
    <Container className="UpdateTripcardForm py-4">
      <Card className="mb-4 p-5" style={{ backgroundColor: '#C1C8E4' }}>
        <Card.Title className="mb-3"> Tripcard for {tripcard.city}</Card.Title>
          <Card.Subtitle className="mb-3">Created on: {formatDate(tripcard.created_on)}</Card.Subtitle>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="keep_private">
                  <Form.Check type="checkbox"
                              name="keep_private"
                              label="Keep private"
                              value="keep_private"
                              checked={formData.keep_private}
                              onChange={handleChange}
                  />
              </Form.Group>

              <Form.Group className="mb-2" controlId="formData.has_visited">
                  <p className="mb-2">Select if you have visited this destination</p>
                    <Form.Check type="checkbox"
                                name="has_visited"
                                label="Visited"
                                value="has_visited"
                                checked={formData.has_visited}
                                onChange={handleChange}
                    />
              </Form.Group>

              {formErrors.length ? 
                <Alert variant="danger">Could not update tripcard. Please try again later </Alert> 
              : 
                null
              }

              {saved ?
                <Alert variant="success">
                  <Alert.Link href="/">Tripcard Updated! {' '} Explore other places</Alert.Link>
                </Alert>        
              : 
                null 
              }

              <div className="text-center">
                <Button className="mb-2" 
                        size="sm"
                        variant="secondary" 
                        type="submit"
                        onClick={handleSubmit}>
                  Update Tripcard
                </Button>
              </div>
            </Form>
        </Card>
    </Container>
  );
}


export default UpdateTripcardForm;