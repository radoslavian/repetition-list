import ApiClient from "./ApiClient";
import debounce from "lodash/debounce";

export function getOnChange(update, apiEndpoint, timeOut = 1000) {
    /*
     * Returns function for updating input text-fields in TaskDetails
     * and related components.
     *
     * update - function for updating component state
     * (MUST be created with the useReducer hook)
     */

    const apiClient = new ApiClient(apiEndpoint);
    const patch = debounce((path, _obj) => apiClient.patch(path, _obj),
                           timeOut);

    return (key, taskId) => ev => {
        const obj = {[key]: ev.currentTarget.value};
        update({...obj});
        patch(`${taskId}/update`, obj);
    };
}

export function today(addDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() + addDays);
    const [isoDate] = date.toISOString().split("T");

    return isoDate;
}

export function deleteTask(taskId, apiEndpoint, onSuccess = f => f) {
    const apiClient = new ApiClient(apiEndpoint);
    apiClient.delete(taskId).then(onSuccess);
}

export function tickOff(taskId, apiEndpoint, onSuccess = f => f) {
    const apiClient = new ApiClient(apiEndpoint);
    apiClient.put(`${taskId}/tick-off`).then(onSuccess);
}

export function getChangeTaskStatus(apiEndpoint, onSuccess = f => f) {
    /* Returns function to activate/deactivate task.*/

    const apiClient = new ApiClient(apiEndpoint);
    return taskId => apiClient.patch(`${taskId}/status`).then(onSuccess);
}

export function getResetTask(apiEndpoint, onSuccess = f => f) {
    const apiClient = new ApiClient(apiEndpoint);
    return taskId => apiClient.patch(`${taskId}/reset`).then(onSuccess);
}
