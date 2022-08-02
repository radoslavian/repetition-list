import PreviousReviews from "./PreviousReviews.js";
import TaskDetails from "./TaskDetails.js";
import TaskTitle from "./TaskTitle.js";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { getOnChange, deleteTask } from "../utils.js";

export default function DueTask(
    { value, dueDate, introDate, taskDetails,
      apiEndpoint = "/v1/task/", onDelete = f => f }) {
    const [title, updateTitle] = useState({title: value});
    const onTitleChange = getOnChange(
        updateTitle, title, apiEndpoint)("title", taskDetails.id);

    return (
        <tr>
          <td>
            <Button>✓</Button>
          </td>
          <td>
            <TaskTitle
              value={title.title}
              onChange={onTitleChange}
            />
          </td>
          <td>
            <TaskDetails taskDetails={taskDetails} />
          </td>
          <td>
            Due&nbsp;date: {dueDate}
          </td>
          <td>
            Introduction&nbsp;Date: {introDate}
          </td>
          <td>
            <PreviousReviews />
          </td>
          <td>
            <Button
              variant="danger"
              onClick={() => deleteTask(taskDetails.id, apiEndpoint,
                                        onDelete)}
            >
              Delete
            </Button>
          </td>
        </tr>
    );
}
