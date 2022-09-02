import { useState } from "react";

export function useTasks(initialSet) {
    // manage list of tasks

    const [tasks, setTasks] = useState(initialSet);

    const addTask = task => setTasks([...tasks, task]);
    const dropTask = task => setTasks(
        tasks.filter((taskVal, i) => task.id !== taskVal.id));

    function updateTask(newData, id) {
        if(!id) throw Error("updateTask: task id number required");
        setTasks(tasks.map(taskItem => taskItem.id === id ?
                           {...taskItem, ...newData} : taskItem));
    }

    return {tasks, setTasks, addTask, dropTask, updateTask};
}
