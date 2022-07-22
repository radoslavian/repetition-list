import PreviousReviews from "./PreviousReviews.js";
import InactiveTaskDetails from "./InactiveTaskDetails.js";
import TaskTitle from "./TaskTitle.js";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from 'react-bootstrap/InputGroup';

export default function DueTask(props) {
    return (
        <tr>
          <td>
            <TaskTitle />
          </td>
          <td>
            <InactiveTaskDetails />
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
