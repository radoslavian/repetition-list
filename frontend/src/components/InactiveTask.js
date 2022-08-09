import PreviousReviews from "./PreviousReviews.js";
import TaskDetails from "./TaskDetails.js";
import TaskTitle from "./TaskTitle.js";
import Button from "react-bootstrap/Button";
import { useState, useCallback } from "react";
import { getOnChange, deleteTask } from "../utils.js";

export default function InactiveTask(
    { introDate, taskDetails, onTickOff,
      toggleUpdate = f => f, apiEndpoint = "/v1/task/" }) {
    const [title, updateTitle] = useState({title: taskDetails.title});
    const onChange = useCallback(getOnChange(
        updateTitle, title, apiEndpoint), []);

    return (
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
            Due date: {taskDetails.due_date}
          </td>
          <td>
            Introduction Date: {taskDetails.intro_date}
          </td>
          <td>
            <PreviousReviews
              taskId={taskDetails.id}
              apiEndpoint={apiEndpoint}
            />
          </td>
          <td>
            <Button variant="danger"
                    onClick={() => deleteTask(taskDetails.id, apiEndpoint,
                                              toggleUpdate)}>
              Delete
            </Button>
          </td>
        </tr>
    );
}
