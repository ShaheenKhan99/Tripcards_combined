import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';


/** LearnMore Modal
 * Is rendered by Homepage to show information about a tripcard and how to use the site
 * 
 * Routed at /
 * 
 */
const LearnMoreModal = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="outline-info" 
              onClick={handleShow}
              className="mb-2">
        Learn more
      </Button>

      <Modal show={show} 
             onHide={handleClose}
             style= {{ color: "#450b45" }}>
        <Modal.Header closeButton>
          <Modal.Title >What are Tripcards?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Keep track of all the things to do or places to visit on your next trip with a 'tripcard'. Want to save a place at any new destination? You will be prompted to create a tripcard first and then add the place to your tripcard.  Keep your tripcard private if you wish. See places other people have saved and get inspired. One tripcard per destination - unlimited places to save. Happy exploring!! </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-info" 
                  onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LearnMoreModal;
