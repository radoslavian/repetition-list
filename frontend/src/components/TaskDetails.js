import Button from "react-bootstrap/Button";
import NewTaskDetails from "./NewTaskDetails.js";
import { getOnChange } from "../utils.js";
import { useState } from "react";

export default function TaskDetails(
    { taskDetails, apiEndpoint = "/v1/task/" }) {
    const [details, updateDetails] = useState(taskDetails);
    const onChange = getOnChange(updateDetails, details, apiEndpoint);
    const onDescChange = onChange("description", taskDetails.id);
    const onMultiplierChange = onChange("multiplier", taskDetails.id);

    return (
        <NewTaskDetails
          descriptionValue={taskDetails.description}
          intervalMultiplier={taskDetails.multiplier}
          onDescChange={onDescChange}
          onMultiplierChange={onMultiplierChange}
        >
          <Button
            variant="primary"
            title="stopSchedulingTaskBt">
            Stop&nbsp;scheduling
          </Button>
          <Button
            variant="warning"
            title="resetTaskBt">
            Reset
          </Button>
        </NewTaskDetails>
    );
}
