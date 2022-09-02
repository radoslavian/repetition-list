import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import NewTaskDetails from "./NewTaskDetails.js";
import debounce from "lodash/debounce";
import { useCallback, useReducer } from "react";
import { useAlerts, useApi, useTasksManager } from "../contexts";

export default function TaskDetails({ taskDetails }) {
    const [details, updateDetails] = useReducer(
        (details, newDetails) => ({...details, ...newDetails}),
        taskDetails
    );
    const { error } = useAlerts();
    const { tasks, updateTask } = useTasksManager();
    const apiClient = useApi();
    const timeout = 500;

    // Without useCallback, function returned wouldn't
    // debounce properly - new function instance would be created
    // on each render; with an empty dependency array - it is created
    // only once.
    // Important: useCallback (or useMemo) need to have correct dependencies
    // attached - otherwise state updates will be incorrect.
    // In case problems arise, consider creating single debounced
    // ApiClient.patch function.

    const handleResponse = (response, newData) => {
        if(!response.ok) {
            error(response.body.status);
        } else {
            updateTask(newData, taskDetails.id);
        }
    };


    function onChange(key) {
        const patch = debounce((route, obj) => apiClient
                               .patch(route, obj)
                               .then(response => handleResponse(
                                   response, obj)), timeout);
        const getValue = ev => { return {[key]: ev.currentTarget.value}; };
        return async ev => {
            const obj = getValue(ev);
            updateDetails({...obj});
            patch(`/task/${details.id}/update`, obj);
        };
    }

    const handleReset = response => response.ok ? updateTask(
        response.body, taskDetails.id) :
          error(`Failed to reset task:\n${response.body.status}`);
    const handleStatusChange = response => response.ok ? updateTask(
        {active: response.body.active}, taskDetails.id) :
          error("Failed to update task!");
    const onDescChange = useCallback(onChange("description"), [tasks]);
    const onMultiplierChange = useCallback(onChange("multiplier"), [tasks]);
    const changeStatus = () => apiClient
          .patch(`/task/${details.id}/status`)
          .then(handleStatusChange);
    const resetTask = () => apiClient
          .patch(`/task/${details.id}/reset`)
          .then(handleReset);

    return (
        <NewTaskDetails
          descriptionValue={details.description}
          intervalMultiplier={details.multiplier}
          onDescChange={onDescChange}
          onMultiplierChange={onMultiplierChange}
        >
          <ButtonGroup vertical>
            <DropdownButton
              variant="warning"
              as={ButtonGroup}
              title="Options"
            >
              <Dropdown.Item
                eventKey="1"
                onClick={resetTask}
              >
                Reset
              </Dropdown.Item>
              <Dropdown.Item
                eventKey="2"
                onClick={changeStatus}
              >
                {details.active ? "Stop scheduling" : "Revert to queue" }
              </Dropdown.Item>
            </DropdownButton>
          </ButtonGroup>
        </NewTaskDetails>
    );
}
