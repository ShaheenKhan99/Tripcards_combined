import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import UserContext from '../auth/UserContext';


/** "Higher-Order Component" for private routes
 * 
 * In routing component, use this instead of <Route..>. This component will check if there is a valid current user and only continues to the route if so. If no user is present, redirects to login form.
 */

 const PrivateRoute = ({ path, children }) => {
  const { currentUser } = useContext(UserContext);

  console.debug("PrivateRoute", 
                "path=", path, 
                "currentUser=", 
                currentUser);

  if (!currentUser) {
    return <Navigate to="/login"  replace />;
  }

  return children;
}

export default PrivateRoute;