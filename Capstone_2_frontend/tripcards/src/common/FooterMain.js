import { Container, Row, Col} from "react-bootstrap";

import yelp_logo from "../assets/yelp_logo.png";
import "./Footer.css";


/** Displays photo and Yelp api data credits on homepage */

const FooterMain = () => {

    return(
            <Container className="Footer-credits mt-5">
              <Row>
                <Col sm={6}>
                  <img className="Footer-yelp-icon mb-1 mt-4" src={yelp_logo} alt="logo" />
                  <p className="yelp-credit text-muted">
                    Data provided by {' '}
                      <a className="Footer-yelp-link"
                        href="https://www.yelp.com/fusion"
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        Yelp Fusion API
                        </a>
                  </p>  
                </Col>

                <Col sm={6}>
                  <p className="Footer-photo-credit text-muted mt-5">
                  Photo by <a href="https://unsplash.com/@victor_g?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Victor</a> {' '}
                  on {' '}
                  <a href="https://unsplash.com/wallpapers/travel/city?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
                  </p> 
                   
                </Col>  
              </Row>
              
            </Container>

        );
  }

  export default FooterMain;
