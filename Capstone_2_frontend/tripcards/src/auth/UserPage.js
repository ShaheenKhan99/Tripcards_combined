import {  useEffect, useContext } from "react";
import { Container } from "react-bootstrap";

import TripcardsApi from "../api/api";
import UserContext from "../auth/UserContext";
import UpdateProfileForm from "./UpdateProfileForm";
import useToggle from "../hooks/useToggle";
import TripcardCardList from "../tripcards/TripcardCardList";
import ReviewCardList from "../reviews/ReviewCardList";
import UserProfile from "../auth/UserProfile";


/** UserPage displays all information about the user 
 * 
 * It displays user profile, tripcards and reviews
 * 
 * The user can update their own profile and reviews
 * 
 * UserPage -> UserProfile -> UpdateProfileForm
 * UserPage -> Tripcards -> TripcardDetail
 * UserPage -> ReviewCardList -> UpdateReview
 * 
*/

const UserPage = ( updateUser, updateReview, updateTripcard ) => {

  const { currentUser, 
          currentUserReviews, 
          currentUserTripcards,
          setCurrentUserReviews,
          setTripcards,
          tripcards
           } = useContext(UserContext);

  console.debug("currentUser=", currentUser);
  
  const [isUpdate, setIsUpdate] = useToggle(false);


  useEffect(function getUserTripcardsAndReviews() {
    async function getTripcardsAndReviewsForUser() {
      setTripcards(await TripcardsApi.getTripcardsByUserID(currentUser.id));
      setCurrentUserReviews(await TripcardsApi.getReviewsByUser(currentUser.id));
    }
    getTripcardsAndReviewsForUser();
  }, [currentUser, setTripcards, setCurrentUserReviews]);

  
  return (
          <>
            <UserProfile />

              <div>
                {isUpdate ? <UpdateProfileForm 
                                        updateUser={updateUser}
                                        setIsUpdate={setIsUpdate}
                            />
                : null }
              </div>


              <div className="UserTripcards-list mt-5">
                {currentUserTripcards ? 
                    (
                      <>
                          <h5 className="mt-2 text-center" style={{ color: '#450b45' }}>Tripcards for {currentUser.username}</h5>
                            
                          <TripcardCardList tripcards={tripcards}
                                            updateTripcard={updateTripcard} /> 
                        </>
                  )
                  : 
                    <div>
                      <h5 className="text-center" style={{ color: '#450b45' }}>No tripcards yet!</h5>
                    </div>
                }   
              </div>


              
                {currentUserReviews.length ? 
                    
                      <Container className="mt-3 p-2">    
                        <h5 className="mt-3 text-center" style={{ color: '#450b45' }}>Reviews by {currentUser.username}</h5>
                          
                        <ReviewCardList reviews={currentUserReviews}
                                        updateReview={updateReview} /> 
                      
                    </Container> 
                  :  
                    <div className="text-center" >
                      <h5 className="mt-5 mb-3 text-center" style={{ color: '#450b45' }}>No reviews yet!</h5>
                    </div>
                }
             

          </>     
      )
  }

export default UserPage;

