import zeroStar from '../assets/small_ratings/small_0.png';
import oneStar from '../assets/small_ratings/small_1.png';
import oneHalfStar from '../assets/small_ratings/small_1_half.png';
import twoStars from '../assets/small_ratings/small_2.png';
import twoHalfStars from '../assets/small_ratings/small_2_half.png';
import threeStars from '../assets/small_ratings/small_3.png';
import threeHalfStars from '../assets/small_ratings/small_3_half.png';
import fourStars from '../assets/small_ratings/small_4.png';
import fourHalfStars from '../assets/small_ratings/small_4_half.png';
import fiveStars from '../assets/small_ratings/small_5.png';
import moment from 'moment';

const getStars = business => {
  const ratingToStars = {
    '0': zeroStar,
    '1': oneStar,
    '1.5': oneHalfStar,
    '2': twoStars,
    '2.5': twoHalfStars,
    '3': threeStars,
    '3.5': threeHalfStars,
    '4': fourStars,
    '4.5': fourHalfStars,
    '5': fiveStars
  };

  return ratingToStars[business.rating];
};


/** Formats date into Month, Day, Year
 * Input format: "2022-12-01T01:51:07.802Z"
 * 
*/

const formatDate = date =>  
  moment(date, "YYYY-MM-DD hh:mm:ss+ZZ").format("MMMM DD, YYYY");


const fullDestination = business => business.city + "#" + business.state + "#" +
business.country



const getAverageRating = business => {
  const average = business.reviews.reduce((total, next) => total + Number(next.rating), 0) / business.reviews.length;
  return Math.round(average * 10) / 10 ;
}



export { getStars, formatDate, fullDestination, getAverageRating };


