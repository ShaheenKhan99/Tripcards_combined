import React, { useState, useContext } from 'react';
import { Form, Modal, Button, Alert } from 'react-bootstrap';

import UserContext from "../auth/UserContext";
import { getCorrectDestination } from "../common/DestinationHelper";


/** CreateTripcard Form
 * Is rendered by BusinessPage and YelpBusinessPage to show form to create a tripcard for user.
 * 
 * Routed at /businesses/:id/
 * 
 *  BusinessPage -> CreateTripcardForm
 *  YelpBusinessPage -> CreateTripcardForm
 * 
 */

const CreateTripcardForm = ({ business }) => {

  const { currentUser, 
          createTripcard,
          setTripcard
           } = useContext(UserContext);


  const [destination, setDestination] = useState();
  const [show, setShow] = useState(false);

  const [saveConfirmed, setSaveConfirmed] = useState();
  const [created, setCreated] = useState();
  
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [formData, setFormData] = useState({ 
                                      destination_id: "",
                                      user_id: "",
                                      username: "",
                                      city: "",
                                      state: "",
                                      country: "",
                                      created_on: "",
                                      keep_private: false,
                                      has_visited: false
  });

  const [formErrors, setFormErrors] = useState([]);


  /** On submit, function fetches correct destination and then creates a tripcard for user */

  async function handleSubmit(evt) {
    evt.preventDefault();

    const destination = await getCorrectDestination(business);
    
    setDestination(destination);

    let data = {
      user_id: currentUser.id,
      destination_id: destination.id,
      username: currentUser.username,
      city: business.city,
      state: business.state,
      country: business.country,
      created_on: new Date(),
      keep_private: formData.keep_private,
      has_visited: formData.has_visited
    }

    let tripcard;

    try {
      await createTripcard(data);
    } catch (errors) {
      setFormErrors(errors);
      return { success: false, errors };
    }  

    setFormData(data => ({ ...data }));
    setFormErrors([]);
    setSaveConfirmed(true)
    setCreated(true); 
    setTripcard(tripcard);
  }

   /** Handle form data changing */

  const  handleChange = (evt) => {
    const { value, checked } = evt.target;
    
    setFormData(data => ({ ...data, [value]: checked }));
    setFormErrors([]);
  }

  return (
      <>
          <Button variant="outline-success"
                  className="mt-3" 
                  onClick={handleShow}
                  disabled={created}>
            Create Tripcard
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Create Tripcard for {business.city}{' '} <span className="text-muted">{business.state} {' '} {business.country}</span></Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="keep_private">
                  <Form.Check
                      type="checkbox"
                      name="keep_private"
                      label="Keep private"
                      value="keep_private"
                      checked={formData.keep_private}
                      onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-2" 
                            controlId="formData.has_visited">
                  <p className="mb-2">Select if you have visited this destination</p>
                    <Form.Check
                          type="checkbox"
                          name="has_visited"
                          label="Visited"
                          value="has_visited"
                          checked={formData.has_visited}
                        onChange={handleChange}
                    />
                </Form.Group>

                    {formErrors.length ? 
                        <Alert variant="danger">
                        Could not create tripcard
                        </Alert>
                    : 
                      null 
                    } 

                    {saveConfirmed ?
                        <Alert variant="success">
                         Tripcard created!
                        </Alert> 
                    : 
                      null 
                    }

              </Form>
            </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" 
                    size="sm"
                    className="mx-4"
                    onClick={handleClose}>
                Cancel
            </Button>
          
          
          <Button variant="outline-success"  
                  size="sm"
                  type="submit"
                  className="mx-2"
                  disabled={created}
                  onClick={handleSubmit}>
              Create Tripcard
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateTripcardForm;