import AddNewTask from "./components/AddNewTask.js";
import TasksGroupSwitcher from "./components/TasksGroupSwitcher.js";
import { useState, useEffect, useReducer } from "react";
import { useApi, useAlerts } from "./contexts";

export default function App() {
    const [allTasks, setAllTasks] = useState([]);
    const { renderAlerts, error } = useAlerts();
    const api = useApi();

    // naive solution
    const [updateTaskList, toggle] = useReducer(
        updateTaskList => !updateTaskList, false);

    function getTasks () {
        api.get("/tasks")
            .then(response => {
                if(response.ok) {
                    setAllTasks(response.body);
                } else {
                    switch (response.status) {
                    case 500:
                        // cannot be reached when proxied from Node
                        // check if works when served statically
                        // from under Flask
                        error(response.body.message);
                        break;
                    default:
                        break;
                        // TODO: add other error-cases
                    }
                }
            });
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
