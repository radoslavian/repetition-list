import AddNewTask from "./components/AddNewTask.js";
import TasksGroupSwitcher from "./components/TasksGroupSwitcher.js";
import { useState, useEffect, useReducer, createContext } from "react";
import ApiClient from "./ApiClient";
import { useAlert } from "./components/Alert";

export const AlertContext = createContext();

export default function App() {
    const [allTasks, setAllTasks] = useState([]);
    const [error, warn, info, renderAlerts] = useAlert();

    // naive solution
    const [updateTaskList, toggle] = useReducer(
        updateTaskList => !updateTaskList, false);

    function getTasks () {
        const apiClient = new ApiClient("/v1");
        apiClient.get("/tasks")
            .then(response => setAllTasks(response.body));
    }
    useEffect(() => getTasks(), [updateTaskList]);

    return (
        <>
          { renderAlerts() }
          <AlertContext.Provider value={[ error, warn, info ]}>
          <AddNewTask
            apiEndpoint="/add-task"
            onSuccessAdd={toggle}
          />
          <TasksGroupSwitcher
            tasksEndpoint="/tasks"
            allTasks={allTasks}
            toggleUpdate={toggle}
          />
        </AlertContext.Provider>
        </>
    );
}
