import AddNewTask from "./components/AddNewTask.js";
import TasksGroupSwitcher from "./components/TasksGroupSwitcher.js";
import { useState, useEffect, useReducer } from "react";
import { useAlerts } from "./contexts";
import ApiClient from "./ApiClient";
import { AlertProvider } from "./contexts";

export default function App() {
    const [allTasks, setAllTasks] = useState([]);
    const { renderAlerts } = useAlerts();

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
          <AddNewTask
            apiEndpoint="/add-task"
            onSuccessAdd={toggle}
          />
          <TasksGroupSwitcher
            tasksEndpoint="/tasks"
            allTasks={allTasks}
            toggleUpdate={toggle}
          />
        </>
    );
}
