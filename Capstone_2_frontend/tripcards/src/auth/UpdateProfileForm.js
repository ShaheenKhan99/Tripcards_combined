import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-bootstrap";

import TripcardsApi from "../api/api";
import UserContext from "../auth/UserContext";
import Alert from "../common/Alert";
import useTimedMessage from "../hooks/useTimedMessage";


/** Profile editing form.
 * 
 * Displays profile form and handles changes to local form state.
 * Submitting the form calls the API to save and triggers user reloading throughout the site.
 * 
 * Confirmation of a successful save is normally a simple <Alert> but we  use limited-time-display message hook.
 * 
 * Routed as /profile
 * Routes -> UserProfile -> ProfileForm -> Alert
 */

const UpdateProfileForm = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
                                      firstName: currentUser.firstName,
                                      lastName: currentUser.lastName,
                                      email: currentUser.email,
                                      username: currentUser.username,
                                      password: "",
                                      bio: currentUser.bio 
                                  });


  const [formErrors, setFormErrors] = useState([]);

  // switch to use limited-time-display message hook
  const [saveConfirmed, setSaveConfirmed] = useTimedMessage();
  const [buttonDisabled, setButtonDisabled] = useState(false)

  console.debug("UpdateProfileForm", 
                "currentUser=", 
                currentUser, 
                "formData=", 
                formData, 
                "formErrors", 
                formErrors, 
                "saveConfirmed=", 
                saveConfirmed
                );

    const navigate = useNavigate();

  /** Handle form submit:
  * on form submit:
  * - attempt save to backend and report any errors
  * - if successful:
  * -- clear previous error messages and password
  * -- show save-confirmed message 
  * -- set current user info throughout the site
  */

  async function handleSubmit(evt) {
    evt.preventDefault();

    let profileData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          username: formData.username,
          password: formData.password,
          bio: formData.bio
  }
  
  let updatedUser;

  try {
        updatedUser = await TripcardsApi.saveProfile(currentUser.id, profileData);
  } catch (errors) {
    setFormErrors(errors);
    return;
  }

  setFormData(data => ({ ...data, password: ""}));
  setFormErrors([]);
  setSaveConfirmed(true)
  setButtonDisabled(true);

  // trigger reloading of user information throughout the site.
  setCurrentUser(updatedUser);
  }

  /** Handle form data changing  */

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormData(data => ({ ...data, [name]: value }));
    setFormErrors([]);  
  }


  /** Handle delete profile  */

  const handleDelete= (evt) => {
    evt.preventDefault();

    let username = formData.username;

    try {
      if(window.confirm(`Are you sure you would like to delete your profile ${username}?`)) {
        
        TripcardsApi.deleteUser(currentUser.id);
        setSaveConfirmed(true);
        setCurrentUser(false);
        navigate("/")
      }
    } catch (errors) {
      setFormErrors(errors);
      return;
    }
    setFormErrors([]); 
  }

  
  return (
    <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4 mt-4">
      <h5 className="text-center mb-3" style={{ color: "#450b45"}}>Profile for {currentUser.username}</h5>
      <Card className="card" style={{ backgroundColor: '#C1C8E4'}}>
        <Card.Body className="card-body">
          <form onSubmit={handleSubmit}>

            <div className="form-group mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input name="username"
                      className="form-control"
                      value={formData.username}
                      onChange={handleChange}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="firstName" className="form-label">First name</label>
                <input name="firstName"
                        className="form-control"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="lastName" className="form-label">Last name</label>
                <input name="lastName"
                        className="form-control"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">Email</label>
                <input name="email"
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleChange}
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

            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">Confirm password to make changes:</label>
                <input name="password"
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
            </div>

            {formErrors.length ? 
                  <Alert type="danger"
                    messages={["Could not update form"]} />
            : 
              null 
            } 

            {saveConfirmed ?
              <Alert type="success"
                      messages={["Updated successfully"]} />
            : 
              null
            }

            <div className="d-grid gap-5 d-sm-flex justify-content-center">
              <Button variant="secondary"
                      type="submit"
                      size="md"
                      disabled={buttonDisabled}
                      onSubmit={handleSubmit}>
                 Update
              </Button>

              <Button variant="danger"
                      size="md"
                      type="submit"
                      onClick={handleDelete}>
                Delete
              </Button>

            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
}


export default UpdateProfileForm;