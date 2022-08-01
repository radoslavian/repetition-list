import AddNewTask from "./components/AddNewTask.js";
import TasksGroupSwitcher from "./components/TasksGroupSwitcher.js";

export default function App() {
    return (
        <>
          <AddNewTask apiEndpoint="/add-task" />
          <TasksGroupSwitcher tasksEndpoint="/tasks" />
        </>
    );
}
