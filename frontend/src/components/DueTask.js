import PreviousReviews from "./PreviousReviews.js";
import TaskDetails from "./TaskDetails.js";
import TaskTitle from "./TaskTitle.js";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from 'react-bootstrap/InputGroup';

export default function DueTask(props) {
    return (
        <tr>
          <td>
            <Button>✓</Button>
          </td>
          <td>
            <TaskTitle />
          </td>
          <td>
            <TaskDetails />
          </td>
          <td>
            Due date
          </td>
          <td>
            Introduction Date
          </td>
          <td>
            <PreviousReviews />
          </td>
          <td>
            <Button variant="danger">
              Delete
            </Button>
          </td>
        </tr>
    );
}
