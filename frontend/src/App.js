import AddNewTask from "./components/AddNewTask.js";
import TasksGroupSwitcher from "./components/TasksGroupSwitcher.js";
import { useEffect } from "react";
import { useApi, useAlerts, useTasksManager } from "./contexts";

export default function App() {
    const { tasks, setTasks } = useTasksManager();
    const { renderAlerts, error } = useAlerts();
    const api = useApi();

    function getTasks () {
        api.get("/tasks").then(response => {
            if(response.ok) {
                setTasks(response.body);
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
    useEffect(getTasks, []);

    return (
        <>
          { renderAlerts() }
            <AddNewTask
              apiEndpoint="/add-task"
            />
            <TasksGroupSwitcher
              tasksEndpoint="/tasks"
              allTasks={tasks}
            />
        </>
    );
}
