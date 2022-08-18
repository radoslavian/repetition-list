import PreviousReviews from "./PreviousReviews.js";
import TaskDetails from "./TaskDetails.js";
import TaskTitle from "./TaskTitle.js";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import DeleteTaskDialog from "./DeleteTaskDialog.js";
import { Trash } from "react-bootstrap-icons";

export default function Task(
    { taskDetails, apiEndpoint = "/v1/task/", toggleUpdate = f => f }) {
    const [deleteModalShow, setDeleteModalShow] = useState(false);

    const handleShow = () => setDeleteModalShow(true);

    return (
        <>
          <DeleteTaskDialog
            show={deleteModalShow}
            setShow={setDeleteModalShow}
            taskDetails={taskDetails}
            apiEndpoint={apiEndpoint}
            onSuccess={toggleUpdate}
          />
          <td>
            <TaskTitle taskDetails={taskDetails}/>
          </td>
          <td>
            <TaskDetails
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
            <PreviousReviews
              apiEndpoint={apiEndpoint}
              taskId={taskDetails.id}
            />
          </td>
          <td>
            <Button
              variant="danger"
              onClick={handleShow}
            >
              <Trash/>
            </Button>
          </td>
        </>
    );
}
