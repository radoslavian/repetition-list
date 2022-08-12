import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { deleteTask } from "../utils.js";

export default function DeleteTaskDialog(
    { taskDetails, apiEndpoint, onSuccess, show, setShow = f => f }) {
    const taskTitle = `${taskDetails.title} (id ${taskDetails.id})`;
    const handleClose = () => setShow(false);
    const success = () => {
        onSuccess();
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Confirm deletion of the task:
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Do you really want to delete task "{taskTitle}"?</p>
            <h6>All data will be lost!</h6>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteTask(taskDetails.id, apiEndpoint, success)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
    );
}
