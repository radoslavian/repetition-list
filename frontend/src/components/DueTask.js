import Button from "react-bootstrap/Button";
import { tickOff } from "../utils.js";
import Task from "./Task.js";

export default function DueTask(
    { taskDetails, toggleUpdate = f => f, apiEndpoint = "/v1/task/" }) {

    return (
        <>
          <td>
            <Button
              aria-label="tick off"
              onClick={() => tickOff(
                  taskDetails.id, apiEndpoint, toggleUpdate)}
            >✓</Button>
          </td>
          <Task
            taskDetails={taskDetails}
            toggleUpdate={toggleUpdate}
            apiEndpoint={apiEndpoint}
          />
        </>
    );
}
