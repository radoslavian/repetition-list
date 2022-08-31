import PreviousReviews from "./PreviousReviews.js";
import TaskDetails from "./TaskDetails.js";
import TaskTitle from "./TaskTitle.js";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import DeleteTaskDialog from "./DeleteTaskDialog.js";
import { Trash } from "react-bootstrap-icons";

export default function Task(
    { taskDetails, toggleUpdate = f => f }) {
    const [deleteModalShow, setDeleteModalShow] = useState(false);

    const handleShow = () => setDeleteModalShow(true);

    return (
        <>
          <DeleteTaskDialog
            show={deleteModalShow}
            setShow={setDeleteModalShow}
            taskDetails={taskDetails}
            onSuccess={toggleUpdate}
          />
          <td>
            <TaskTitle taskDetails={taskDetails}/>
          </td>
          <td>
            <TaskDetails
              aria-label="task details"
              taskDetails={taskDetails}
              toggleUpdate={toggleUpdate}
            />
          </td>
          <td>
            {taskDetails.due_date}
          </td>
          <td>
            {taskDetails.intro_date}
          </td>
          <td>
            <PreviousReviews taskId={taskDetails.id}/>
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
