import { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

import UserContext from "./UserContext";
import Alert from "../common/Alert";

/** Login form.
 * 
 * Shows form and manages update to state on changes.
 * On submission:
 * - calls login function prop
 * - redirects to /profile route
 * 
 * Routes -> LoginForm -> Alert
 * 
 * Routed as /login 
 */

const LoginForm = ({ login }) => {

  const navigate = useNavigate();
  
  const [formErrors, setFormErrors] = useState([]);

  const [formData, setFormData] = useState({ 
                                            username: "",
                                            password: ""
                                          });

  const { currentUser } = useContext(UserContext);


  console.debug("LoginForm", 
                  "login=", 
                  typeof login, 
                  "formData=", 
                  formData, 
                  "formErrors", 
                  formErrors,
                  "currentUser=",
                  currentUser
                  );

  if (currentUser) {
    return <Navigate to="/" />;
  }

  /** Handle form submit:
   * Calls login func prop and, if successful, redirect to home page.
   */

  async function handleSubmit(evt) {
    evt.preventDefault();

    let result = await login(formData);
    
    if (result.success) {
      navigate("/");
    } else {
      setFormErrors(result.errors);  
    }
  }

  
  /** Update form data field as input is entered by user */

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormData(data => ({ ...data, [name]: value }));
    setFormErrors([]);
  }

  return (
        <div className="LoginForm">
          <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            <h5 className="mb-3 text-center" style={{ color: "#450b45" }}>Welcome!</h5>
            
            <Card className="card" style={{ backgroundColor: '#C1C8E4' }}>
              <Card.Body className="card-body" >
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="username">Username</label>
                    <input name="username"
                            className="form-control"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="username"
                            required
                          />
                    </div>

                    <div className="form-group mb-3">
                      <label className="label" htmlFor="password">Password</label>
                        <input name="password"
                                className="form-control"
                                value={formData.password}
                                type="password"
                                onChange={handleChange}
                                autoComplete="current-password"
                                required
                          />
                      </div>

                      {formErrors.length ? 
                        <Alert type="danger"
                        messages={["Incorrect username or password. Please try again."]} /> 
                      : 
                        null
                      }

                      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                        <Button type="submit" 
                                variant="primary"
                                size="md"
                                onSubmit={handleSubmit}>
                          Login
                        </Button>
                      </div>
                </form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default LoginForm;