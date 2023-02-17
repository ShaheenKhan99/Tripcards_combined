import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

import Alert from "../common/Alert";


/** Signup form.
 * 
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls signup function prop
 * - redirects to homepage route
 * 
 * Routes -> SignupForm -> Alert
 * 
 * Routed as /signup 
 */

const SignupForm = ({ signup }) => {

  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState([]);
  const [formData, setFormData] = useState({
                                    username: "",
                                    password: "",
                                    first_name: "",
                                    last_name: "",
                                    email: "",
                                    bio: ""
                                });


  /** Handle form submit:
   * Calls signup func prop and, if successful, redirect to /homepage.
   */

  async function handleSubmit(evt) {
    evt.preventDefault();

    let result = await signup(formData);
    
      if (result.success) {
        navigate("/") 
        } else {
       setFormErrors(result.errors);
      }
  }

  
  /** Update form data field  */

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormData(data => ({ ...data, [name]: value }));
    setFormErrors([]);
  }

  return (
    <div className="SignupForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h5 className="mb-3 text-center" style={{ color: "#450b45"}}>Sign Up</h5>
        <Card className="card">
          <Card.Body className="card-body" style={{ backgroundColor: '#C1C8E4' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-2">
                <label className="label" htmlFor="username">Username</label>
                  <input name="username"
                         type="text"
                         className="form-control"
                         value={formData.username}
                         onChange={handleChange}
                         required
                  />
              </div>
              <div className="form-group mb-2">
                <label className="label" htmlFor="password">Password</label>
                  <input name="password"
                         className="form-control"
                         type="password"
                         value={formData.password}
                         onChange={handleChange}
                         required
                  />
              </div>
              <div className="form-group mb-2">
                <label className="label" htmlFor="first_name">First name</label>
                  <input name="first_name"
                         type="text"
                         className="form-control"
                         value={formData.first_name}
                         onChange={handleChange}
                         required
                  />
              </div>
              <div className="form-group mb-2">
                <label className="label" htmlFor="last_name">Last name</label>
                  <input name="last_name"
                         type="text"
                         className="form-control"
                         value={formData.last_name}
                         onChange={handleChange}
                         required
                  />
              </div>
              <div className="form-group mb-2">
                <label className="label" htmlFor="email">Email</label>
                  <input name="email"
                         type="email"
                         className="form-control"
                         value={formData.email}
                         onChange={handleChange}
                         required
                  />
              </div>
              <div className="form-group mb-3">
              <label htmlFor="bio" className="form-label">Bio</label>
                <textarea name="bio"
                          type="text-area"
                          className="form-control"
                          value={formData.bio}
                          placeholder="Enter bio"
                          onChange={handleChange}
                />
            </div>

              {formErrors.length ? 
                  <Alert type="danger"
                         messages={["Could not sign you up. Please try again."]} />
              : 
                null 
              } 


              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <Button type="submit" 
                        variant="primary"
                        size="md"
                        onSubmit={handleSubmit}>
                  Submit
                </Button>
              </div>

            </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default SignupForm;