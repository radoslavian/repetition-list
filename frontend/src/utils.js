import ApiClient from "./ApiClient";
import debounce from "lodash/debounce";

export function getOnChange(update, apiEndpoint, fail = f => f,
                            timeOut = 1000) {
    /*
     * Returns function for updating input text-fields in TaskDetails
     * and related components.
     *
     * update - function for updating component state
     */

    const apiClient = new ApiClient(apiEndpoint);

    return (key, taskId) => {
        const handleFail = async response => {
            if(!response.ok) {
                fail(response);
                const response_ = await apiClient.get(`/${taskId}`);
                const obj = {[key]: response_.body[key]};
                update({...obj});
            }
        };
        const patch = debounce((path, _obj) => apiClient
                               .patch(path, _obj)
                               .then(handleFail), timeOut);
        const getValue = ev => { return {[key]: ev.currentTarget.value}; };

        return async ev => {
            const obj = getValue(ev);
            update({...obj});
            patch(`${taskId}/update`, obj);
        };
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
