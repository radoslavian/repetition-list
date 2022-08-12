import PreviousReviews from "./PreviousReviews.js";
import TaskDetails from "./TaskDetails.js";
import TaskTitle from "./TaskTitle.js";
import Button from "react-bootstrap/Button";
import { useState, useCallback } from "react";
import { getOnChange, deleteTask, tickOff } from "../utils.js";

export default function DueTask(
    { taskDetails, toggleUpdate = f => f, apiEndpoint = "/v1/task/" }) {
    const [title, updateTitle] = useState({title: taskDetails.title});
    const onChange = useCallback(getOnChange(
        updateTitle, apiEndpoint), []);
    const onTitleChange = onChange("title", taskDetails.id);

    return (
        <tr>
          <td>
            <Button onClick={() => tickOff(
                taskDetails.id, apiEndpoint, toggleUpdate)}
            >✓</Button>
          </td>
          <td>
            <TaskTitle
              value={title.title}
              onChange={onTitleChange}
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
              taskId={taskDetails.id}
              apiEndpoint={apiEndpoint}
            />
          </td>
          <td>
            <Button
              variant="danger"
              onClick={() => deleteTask(taskDetails.id, apiEndpoint,
                                        toggleUpdate)}
            >
              Delete
            </Button>
          </td>
        </tr>
    );
}
