import ButtonGroup from "react-bootstrap/ButtonGroup";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import NewTaskDetails from "./NewTaskDetails.js";
import debounce from "lodash/debounce";
import { useCallback, useReducer } from "react";
import { useAlerts, useApi } from "../contexts";

export default function TaskDetails({ apiEndpoint = "/v1/task/", taskDetails,
                                      toggleUpdate = f => f }) {
    const [details, updateDetails] = useReducer(
        (details, newDetails) => ({...details, ...newDetails}),
        taskDetails
    );
    const { error } = useAlerts();
    const apiClient = useApi();
    const timeout = 500;

    // Without useCallback, function returned wouldn't
    // debounce properly - new function instance would be created
    // on each render; with an empty dependency array - it is created
    // only once.

    const handleResponse = response => {
        if(!response.ok) error(response.body.status);
    };

    function onChange(key) {
        const patch = debounce((route, obj) => apiClient
                               .patch(route, obj)
                               .then(handleResponse), timeout);
        const getValue = ev => { return {[key]: ev.currentTarget.value}; };
        return async ev => {
            const obj = getValue(ev);
            updateDetails({...obj});
            patch(`/task/${details.id}/update`, obj);
        };
    }

    const onDescChange = useCallback(onChange("description"), []);
    const onMultiplierChange = useCallback(
        onChange("multiplier"), []);
    const changeStatus = () => apiClient
          .patch(`/task/${details.id}/status`)
          .then(toggleUpdate);
    const resetTask = () => apiClient
          .patch(`/task/${details.id}/reset`)
          .then(toggleUpdate);

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
