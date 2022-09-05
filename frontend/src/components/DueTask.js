import Button from "react-bootstrap/Button";
import { useAlerts, useApi, useTasksManager } from "../contexts";
import Task from "./Task.js";

export default function DueTask(
    { taskDetails }) {
    const apiClient = useApi();
    const { updateTask } = useTasksManager();
    const { error } = useAlerts();

    const handleResponse = response => response.ok ? updateTask(
        {"due_date": response.body.due_date}, taskDetails.id)
          : error(response.body.status);

    return (
        <>
          <td>
            <Button
              aria-label="tick off"
              onClick={() => apiClient
                       .put(`/task/${taskDetails.id}/tick-off`)
                       .then(handleResponse)}
            >
              ✓
            </Button>
          </td>
          <Task taskDetails={taskDetails} />
        </>
    );
}
