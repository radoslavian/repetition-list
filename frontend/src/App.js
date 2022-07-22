//import AddNewTask from "./components/AddNewTask.js";
import TasksGroupSwitcher from "./components/TasksGroupSwitcher.js";

export default function App() {
    const rows = [
        {date: "12.01.2024",
         multiplier: 1.4},
        {date: "18.01.2024",
         multiplier: 2.0},
        {date: "10.02.2024",
         multiplier: 1.2}
    ];

    return (
        <TasksGroupSwitcher />
    );
}
