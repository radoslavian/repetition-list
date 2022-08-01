import PreviousReviews from "./PreviousReviews.js";
import TaskDetails from "./TaskDetails.js";
import TaskTitle from "./TaskTitle.js";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { getOnChange, deleteTask } from "../utils.js";

export default function UpcomingTask(
    { value, dueDate, introDate, taskDetails,
      apiEndpoint = "/v1/task/" }) {
    const [title, updateTitle] = useState({title: value});
    const onTitleChange = getOnChange(
        updateTitle, title, apiEndpoint)("title", taskDetails.id);

    return (
        <tr>
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
              onClick={() => deleteTask(taskDetails.id, apiEndpoint)}
            >
              Delete
            </Button>
          </td>
        </tr>
    );
}
