import AddNewTask from "./components/AddNewTask.js";
import TasksGroupSwitcher from "./components/TasksGroupSwitcher.js";
import { useState, useEffect, useReducer } from "react";
import ApiClient from "./ApiClient";

export default function App() {
    const [allTasks, setAllTasks] = useState([]);

    // naive solution
    const [updateTaskList, toggle] = useReducer(
        updateTaskList => !updateTaskList, true);

    function getTasks () {
        const apiClient = new ApiClient("/v1");
        apiClient.get("/tasks")
            .then(response => setAllTasks(response.body));
    }
    useEffect(() => getTasks(), [updateTaskList]);

    return (
        <>
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
