import Button from "react-bootstrap/Button";
// import { tickOff } from "../utils.js";
import { useApi } from "../contexts";
import Task from "./Task.js";

export default function DueTask(
    { taskDetails, toggleUpdate = f => f, apiEndpoint = "/v1/task/" }) {
    const apiClient = useApi();

    return (
        <>
          <td>
            <Button
              aria-label="tick off"
              onClick={
                  () => apiClient
                      .put(`/task/${taskDetails.id}/tick-off`)
                      .then(toggleUpdate)
              }
            >
              ✓
            </Button>
          </td>
          <Task
            taskDetails={taskDetails}
            toggleUpdate={toggleUpdate}
            apiEndpoint={apiEndpoint}
          />
        </>
    );
}
