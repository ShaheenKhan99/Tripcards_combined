import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

import TripcardsApi from "../api/api";
import UserContext from "../auth/UserContext";
import Alert from "../common/Alert";
import useTimedMessage from "../hooks/useTimedMessage";


/** Review update form.
 * 
 * Displays updateReview form and handles changes to state on changes.
 * On submission:
 * - calls updateReview function prop
 * 
 * Routed as /reviews/:id/update
 * 
 * Routes -> UserPage -> UpdateReviewForm -> Alert
 */

const UpdateReviewForm = () => {
  
  const { currentUser} = useContext(UserContext);
  const { id } = useParams();
  
  const [formData, setFormData] = useState({ 
                                        user_id: "",
                                        username: "",
                                        business_id: "",
                                        business_name: "",
                                        text: "",
                                        rating: "",
                                        created_on: "",
                                        image_url: ""  
                                        });

  const [formErrors, setFormErrors] = useState([]);
  const [review, setReview] = useState(null);

  const [saveConfirmed, setSaveConfirmed] = useTimedMessage();
  const [deleteReview, setDeleteReview] = useState()
  const [deleted, setDeleted] = useState(false);
  

  useEffect(function getReview(){
    async function getReview(){
      const review = await TripcardsApi.getReview(id);
      setFormData({ user_id: currentUser.id,
                    username: currentUser.username,
                    business_id: review.business_id,
                    business_name: review.business_name,
                    text: review.text,
                    rating: review.rating,
                    created_on: review.created_on,
                    image_url: review.image_url
      }) 
    };
    getReview();
  }, [id, currentUser]);
 

  /** Handle updateReview form submit: 
   * on form submit
   * - attempt save to backend and report any errors
   * - if successful:
   * - clear previous error messages
   * - show save confirmed message
  */

  async function handleSubmit(evt) {
    evt.preventDefault();

    let data = {
              user_id: currentUser.id,
              username: currentUser.username,
              business_id: formData.business_id,
              business_name: formData.business_name,
              text: formData.text,
              rating: formData.rating,
              created_on: formData.created_on,
              image_url: formData.image_url  
    }

    let updatedReview;
    try {
      updatedReview = await TripcardsApi.updateReview(id, data); 
      setReview(updatedReview);
    } catch(errors) {
      setFormErrors(errors);
      return;
    }
    
    setFormData(data => ({ ...data}));
    setFormErrors([]);
    setSaveConfirmed(true);
  } 


  /** Update form data field */

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormData(data => ({ ...data, [name]: value }));
    setFormErrors([]);  
  }

 
  /** Handle deleteReview click */

  async function handleDeleteClick(evt) {
    evt.preventDefault()
    try {
      setDeleteReview(TripcardsApi.deleteReview(id));
      setDeleted(true);
    } catch (err) {
      setFormErrors(err);
      return;
    }
  }
 

  return (
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4 mt-4">
          <h5 className="text-center mb-3" style={{ "color": "#450b45"}}>Update review for  {formData.business_name}</h5>
          <Card className="card" style={{ backgroundColor: '#C1C8E4' }}>
            <Card.Body className="card-body">

              <form onSubmit={handleSubmit}>

                <div className="form-group mb-3">
                  <label htmlFor="text" className="form-label">Review</label>
                    <textarea name="text"
                              className="form-control"
                              value={formData.text}
                              onChange={handleChange}
                    />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="rating">Rating</label>
                    <select
                          name="rating"
                          value={formData.rating}
                          onChange={handleChange}
                          className="custom-select"
                    >
                      <option disabled>Rating</option>
                      <option value="1">1</option>
                      <option value="1.5">1.5</option>
                      <option value="2">2</option>
                      <option value="2.5">2.5</option>
                      <option value="3">3</option>
                      <option value="3.5">3.5</option>
                      <option value="4">4</option>
                      <option value="4.5">4.5</option>
                      <option value="5">5</option>
                    </select>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="image_url" className="form-label">Image url</label>
                  <input name="image_url"
                       type="url"
                       className="form-control"
                       value={formData.image_url}
                       onChange={handleChange}
                  />
                </div>
            
                {formErrors.length ? 
                  <Alert type="danger"
                    messages={["Could not update. Try again later"]} />
                : 
                  null 
                } 

                {saveConfirmed ?
                  <Alert type="success"
                          messages={["Updated successfully"]} />           
                : 
                  null 
                }
                  
                {deleted ?
                  <Alert type="danger"
                         messages={["Deleted! Explore other places"]}  />  
                : 
                  null
                }

                <div className="d-grid gap-5 d-sm-flex justify-content-center">
                  <Button variant="outline-primary"
                          type="submit"
                          size="md"
                          onSubmit={handleSubmit}>
                    Update Review
                  </Button>
                </div>
                  
                <div className="d-grid gap-5 d-sm-flex justify-content-center mt-3">
                  <Button variant="outline-danger"
                          size="md"
                          type="submit"
                          disabled={deleted}
                          onClick={handleDeleteClick}>
                    Delete
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </div>
  );
}


export default UpdateReviewForm;
