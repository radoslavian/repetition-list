import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useApi } from "../contexts";

export default function DeleteTaskDialog(
    { taskDetails, onSuccess, show, setShow = f => f }) {
    const taskTitle = `${taskDetails.title} (id ${taskDetails.id})`;
    const handleClose = () => setShow(false);
    const success = () => {
        onSuccess();
        handleClose();
    };
    const apiClient = useApi();
    const handleDelete = () => apiClient
          .delete(`/task/${taskDetails.id}`).then(success);

    return (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              Confirm deletion of the task:
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Do you really want to delete task "{taskTitle}"?</p>
            <h6>All data related to this task  will be lost!</h6>
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
              onClick={() => handleDelete(taskDetails.id, success)}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
    );
}
