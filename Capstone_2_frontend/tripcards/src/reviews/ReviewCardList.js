import ReviewCard from "./ReviewCard";

/** Show list of review cards.
 * 
 * Used by ReviewCardList, UserPage and BusinessPage to list reviews.
 * 
 * ReviewCardList -> ReviewCard
 * BusinessPage -> ReviewCardList -> ReviewCard
 * UserPage -> ReviewCardList -> ReviewCard
 * 
 */

 const  ReviewCardList = ({ reviews, updateReview }) =>  {
  console.debug("ReviewCardList", "reviews=", reviews);

  return (
      <div className="ReviewCardList">
        {reviews ? 
          reviews.map(r => (
                <ReviewCard key={r.id}
                            id={r.id}
                            user_id={r.user_id}
                            username={r.username}
                            business_id={r.business_id}
                            business_name={r.business_name}
                            text={r.text}
                            rating={r.rating}
                            created_on={r.created_on}
                            image_url={r.image_url} 
                            updateReview={updateReview}
                        
                />
          )) 
        :
          null}
      </div>
  );
}

export default ReviewCardList;