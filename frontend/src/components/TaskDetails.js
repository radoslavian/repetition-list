import Button from "react-bootstrap/Button";
import NewTaskDetails from "./NewTaskDetails.js";
import { getOnChange, getChangeTaskStatus, getResetTask } from "../utils.js";
import { useState, useCallback } from "react";

export default function TaskDetails(
    { taskDetails, apiEndpoint = "/v1/task/", toggleUpdate = f => f }) {
    const [details, updateDetails] = useState(taskDetails);

    // Without useCallback, function returned wouldn't
    // debounce properly (new function instance would be created
    // on each render).
    const onChange = useCallback(getOnChange(
        updateDetails, details, apiEndpoint), []);
    const changeStatus = getChangeTaskStatus(apiEndpoint, toggleUpdate);
    const resetTask = getResetTask(apiEndpoint, toggleUpdate);

    return (
        <NewTaskDetails
          descriptionValue={details.description}
          intervalMultiplier={details.multiplier}
          onDescChange={onChange("description", details.id)}
          onMultiplierChange={onChange("multiplier", details.id)}
        >
          <Button
            variant="primary"
            title="stopSchedulingTaskBt"
            onClick={() => changeStatus(taskDetails.id)}
          >
            {taskDetails.active ? "Stop scheduling" : "Revert to queue" }
          </Button>
          <Button
            variant="warning"
            title="resetTaskBt"
            onClick={() => resetTask(taskDetails.id)}
          >
            Reset
          </Button>
        </NewTaskDetails>
    );
}
