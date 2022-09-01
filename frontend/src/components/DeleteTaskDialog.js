import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useAlerts, useApi, useTasksManager } from "../contexts";

export default function DeleteTaskDialog(
    { taskDetails, onSuccess, show, setShow = f => f }) {
    const taskTitle = `${taskDetails.title} (id ${taskDetails.id})`;
    const { dropTask } = useTasksManager();
    const handleClose = () => setShow(false);
    const apiClient = useApi();
    const { error } = useAlerts();

    function handleResponse(response) {
        if(response.ok) {
            dropTask(taskDetails);
            handleClose();
        } else {
            error(response.status);
        }
    }

    const handleDelete = () => apiClient
          .delete(`/task/${taskDetails.id}`)
          .then(handleResponse);

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
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
    );
}
