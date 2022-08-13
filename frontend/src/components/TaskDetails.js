import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import NewTaskDetails from "./NewTaskDetails.js";
import Card from "react-bootstrap/Card";
import { getOnChange, getChangeTaskStatus, getResetTask } from "../utils.js";
import { useCallback, useReducer } from "react";

export default function TaskDetails(
    { taskDetails, apiEndpoint = "/v1/task/", toggleUpdate = f => f }) {
    const [details, updateDetails] = useReducer(
        (details, newDetails) => ({...details, ...newDetails}),
        taskDetails
    );

    // Without useCallback, function returned wouldn't
    // debounce properly - new function instance would be created
    // on each render; with empty dependency array - it is created
    // only once.

    const onChange = useCallback(getOnChange(
        updateDetails, apiEndpoint), []);
    const changeStatus = getChangeTaskStatus(apiEndpoint, toggleUpdate);
    const resetTask = getResetTask(apiEndpoint, toggleUpdate);

    return (
        <NewTaskDetails
          descriptionValue={details.description}
          intervalMultiplier={details.multiplier}
          onDescChange={onChange("description", details.id)}
          onMultiplierChange={onChange("multiplier", details.id)}
        >
          <ButtonGroup vertical>
            <DropdownButton
              variant="warning"
              as={ButtonGroup}
              title="Options"
            >
              <Dropdown.Item
                eventKey="1"
                onClick={() => resetTask(taskDetails.id)}
              >
                Reset
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="2"
                onClick={() => changeStatus(taskDetails.id)}
              >
                {taskDetails.active ? "Stop scheduling" : "Revert to queue" }
              </Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
        </NewTaskDetails>
    );
}
