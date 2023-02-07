import React, { useState }  from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TaskDetails from "./TaskDetails.js";
import PreviousReviews from "./PreviousReviews.js";

export default function TaskDetailsModal(props) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // tests:
    // does the modal show up?
    // do TaskDetails show correct content within the modal?
    // do PreviousReviews show correct content?

    // show button shall be turned into a text link
    return (
        <>
          <Button variant="link" onClick={handleShow}>
            Details&hellip;
          </Button>

          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Task: <i>{props.taskDetails.title}</i>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <TaskDetails taskDetails={props.taskDetails}/>
              <table className="table">
                <tbody>
                  <tr>
                    <td>Due date:</td>
                    <td>{props.taskDetails.due_date}</td>
                  </tr>
                  <tr>
                    <td>Introduced on:</td>
                    <td>{props.taskDetails.intro_date}</td>
                  </tr>
                </tbody>
              </table>
              <PreviousReviews taskId={props.taskDetails.id}/>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
    );
}
