import ApiClient from "./ApiClient";

export function getOnChange(update, details, apiEndpoint) {
    /* Returns functions for updating input-fields in TaskDetails
     * and related components. */

    const apiClient = new ApiClient(apiEndpoint);
    return (key, taskId) => e => {
        const obj = {[key]: e.currentTarget.value};
        apiClient.patch(`${taskId}/update`, obj);
        update({...details, ...obj});
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
