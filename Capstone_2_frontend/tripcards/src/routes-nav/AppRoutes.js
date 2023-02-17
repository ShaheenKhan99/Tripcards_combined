import { Routes, Route } from "react-router-dom";
import Homepage from "../homepage/Homepage";

import SearchYelpBusinesses from "../yelpbusinesses/SearchYelpBusinesses";
import YelpBusinessPage from "../yelpbusinesses/YelpBusinessPage";
import YelpBusinessReviews from "../yelpbusinesses/YelpBusinessReviews";

import SignupForm from "../auth/SignupForm";
import LoginForm from "../auth/LoginForm";
import UpdateProfileForm from "../auth/UpdateProfileForm";
import UserPage from "../auth/UserPage";

import BusinessList from "../businesses/BusinessList";
import BusinessPage from "../businesses/BusinessPage";
import AddReviewForm from "../reviews/AddReviewForm";
import UpdateReviewForm from "../reviews/UpdateReviewForm";

import UpdateTripcardForm from "../tripcards/UpdateTripcardForm";
import TripcardList from "../tripcards/TripcardList";
import TripcardPage from "../tripcards/TripcardPage";
import TripcardBusinesses from "../tripcards/TripcardBusinesses";

import PrivateRoute from './PrivateRoute';
import NotFound from "../NotFound";


/** Site-wide routes.
 * 
 * Parts of site should only be visible when logged in. Those routes are wrapped by <PrivateRoute> which is an authorization component.
 * 
 * Visiting a non-existent route redirects to the Not Found page
 */

const AppRoutes = ({ login, signup, tripcard }) => {
console.debug("Routes", `login=${typeof login}`,
                        `signup=${typeof signup}}`
                      );
        return (
                <div>
                  <Routes>

                    <Route path="/"
                           element={<Homepage />}
                    />

                    <Route path="/signup"
                           element={<SignupForm signup={signup} />}
                    />

                    <Route path="/login"
                           element={<LoginForm login={login} />}
                    />

                    <Route path="/update"
                           element={<PrivateRoute>
                                      <UpdateProfileForm />
                                    </PrivateRoute>}
                    />

                    <Route path="/profile"
                           element={<PrivateRoute>
                                      <UserPage  />
                                    </PrivateRoute>}
                    />

                    <Route  path="/tripcards"
                            element={<PrivateRoute>
                                        <TripcardList />
                                      </PrivateRoute>}
                    />

                    <Route path="/tripcards/:id/update"
                          element={<PrivateRoute>
                                    <UpdateTripcardForm />
                                   </PrivateRoute>}
                    />

                    <Route path="/tripcards/:id"
                           element={<PrivateRoute>
                                      <TripcardPage tripcard={tripcard} />
                                     </PrivateRoute>}
                    />

                    <Route path="tripcards/:id/businesses"
                           element={ <PrivateRoute>
                                       <TripcardBusinesses />
                                     </PrivateRoute>}
                      />

                    <Route path="tripcards/:id/delete/:business_id"
                           element={ <PrivateRoute>
                                        <TripcardBusinesses />
                                     </PrivateRoute>}
                    />    
                      

                    <Route path="/businesses"
                          element={<PrivateRoute>
                                      <BusinessList />
                                   </PrivateRoute>}
                    />

                    <Route path="/businesses/:id/reviews"
                           element={<PrivateRoute>
                                      <AddReviewForm />
                                    </PrivateRoute>}
                    />

                     <Route path="/reviews/:id/update"
                            element={<PrivateRoute>
                                      <UpdateReviewForm />
                                    </PrivateRoute>}
                    />

                    <Route path="/businesses/:id"
                           element={<PrivateRoute>
                                      <BusinessPage />
                                    </PrivateRoute>}
                    />                 

                    <Route path="api/businesses/:yelp_id/reviews"
                           element={
                                    <YelpBusinessReviews />
                                   }
                    />

                    <Route path="api/businesses/:yelp_id"
                           element={<PrivateRoute>
                                          <YelpBusinessPage />
                                   </PrivateRoute>}
                    />        

                    <Route path="api/businesses/search"
                           element={
                                    <SearchYelpBusinesses />
                                    }
                    />                         
        
                    <Route path="*"
                          element={<NotFound />}
                    />
        
                  </Routes>
                </div>
        );
    }

export default AppRoutes;