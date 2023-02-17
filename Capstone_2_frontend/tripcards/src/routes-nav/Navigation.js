import { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import UserContext from '../auth/UserContext';
import "./Navigation.css";


/** Navigation bar for site. Shows up on every page.
 * 
 * When user is logged in, shows links to main areas of site. When not, it shows links to Login and Signup forms.
 * 
 * Rendered by App
 */

const Navigation = ({ logout }) => {
  const { currentUser } = useContext(UserContext);

  console.debug("Navigation", 
                "currentUser=", 
                  currentUser);

  function loggedInNav() {
    return (
            <nav className="navbar">

              <NavLink className="nav-item nav-link me-4" to="/businesses">
                User Favorites
              </NavLink>
              
              <NavLink className="nav-item nav-link me-4" to="/tripcards">
                All Tripcards
              </NavLink>

              <NavLink className="nav-item nav-link me-4" to="/profile">
                My Tripcards
              </NavLink>

              <NavLink className="nav-item nav-link me-4" 
                        to="/" onClick=   {logout}>
                  Logout - {currentUser.username || currentUser.firstName}
              </NavLink>
            </nav>
           );
        }

  function loggedOutNav() {
    return (
            <nav className="navbar">

              <NavLink className="nav-item nav-link me-4" to="/login">
                Login
              </NavLink>
    
              <NavLink className="nav-item nav-link me-4" to="/signup">
                Signup
              </NavLink>    
            </nav>
          );
        }

  return (
          <nav className="Navigation navbar mb-3">
            <div className="container-fluid">
   
              <NavLink className="navbar-brand" 
                        style={{ "color": "#f1ddeb" }}
                        to="/">
                  Tripcards
               </NavLink>

                  {currentUser ? loggedInNav() : loggedOutNav()}

            </div>
          </nav>
  );
}

export default Navigation;