import PreviousReviews from "./PreviousReviews.js";
import TaskTitle from "./TaskTitle.js";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import DeleteTaskDialog from "./DeleteTaskDialog.js";
import { Trash } from "react-bootstrap-icons";
import TaskDetailsModal from "./TaskDetailsModal.js";

export default function Task({ taskDetails }) {
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const handleShow = () => setDeleteModalShow(true);

    return (
        <>
          <DeleteTaskDialog
            show={deleteModalShow}
            setShow={setDeleteModalShow}
            taskDetails={taskDetails}
          />
          <td>
            <TaskTitle taskDetails={taskDetails}/>
          </td>
          <td>
            <TaskDetailsModal taskDetails={taskDetails}/>
          </td>
          <td>
            {taskDetails.due_date}
          </td>
          <td>
            {taskDetails.intro_date}
          </td>
          <td>
            <Button
              variant="danger"
              aria-label="delete"
              onClick={handleShow}
            >
              <Trash/>
            </Button>
          </td>
        </>
    );
}
