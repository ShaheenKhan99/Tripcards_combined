import { Container, Row, Col} from "react-bootstrap";

import yelp_logo from "../assets/yelp_logo.png";
import "./Footer.css";


/** Displays photo and Yelp api data credits on homepage */

const Footer = () => {

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
                </Col>  
              </Row>
              
            </Container>

        );
  }

  export default Footer;
