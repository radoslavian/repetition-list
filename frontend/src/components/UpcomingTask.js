import PreviousReviews from "./PreviousReviews.js";
import TaskDetails from "./TaskDetails.js";
import TaskTitle from "./TaskTitle.js";
import Button from "react-bootstrap/Button";
import { useState, useCallback } from "react";
import { getOnChange } from "../utils.js";
import DeleteTaskDialog from "./DeleteTaskDialog.js";

export default function UpcomingTask(
    { taskDetails, apiEndpoint = "/v1/task/", toggleUpdate = f => f }) {
    const [title, updateTitle] = useState({title: taskDetails.title});
    const onChange = useCallback(getOnChange(
        updateTitle, apiEndpoint), []);
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
        <tr>
          <td>
            <TaskTitle
              value={title.title}
              onChange={onChange("title", taskDetails.id)}
            />
          </td>
          <td>
            <TaskDetails
              taskDetails={taskDetails}
              toggleUpdate={toggleUpdate}
            />
          </td>
          <td>
            Due&nbsp;date: {taskDetails.due_date}
          </td>
          <td>
            Introduction&nbsp;Date: {taskDetails.intro_date}
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
              Delete
            </Button>
          </td>
        </tr>
        </>
    );
}
