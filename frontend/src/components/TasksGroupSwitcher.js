import Table from "react-bootstrap/Table";
import DueTask from "./DueTask.js";
import InactiveTask from "./InactiveTask.js";
import UpcomingTask from "./UpcomingTask.js";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import ApiClient from "../ApiClient";
import { useState, useEffect } from "react";

export default function TaskGroupSwitcher({ tasksEndpoint }) {
    const [key, setKey] = useState("upcoming");
    const [allTasks, setAllTasks] = useState([]);
    const dueTasks = allTasks.filter(
        task => new Date(task.due_date) <= new Date());
    const upcomingTasks = allTasks.filter(
        task => new Date(task.due_date) > new Date()).reverse();
    const inactiveTasks = allTasks.filter(task => !task.active);

    function getTasks () {
        const apiClient = new ApiClient("/v1");
        apiClient.get(tasksEndpoint)
            .then(response => setAllTasks(response.body));
    }
    useEffect(() => getTasks(), []);

    return (
        <Tabs
          id="tasks-group-switcher"
          activeKey={key}
          onSelect={k => setKey(k)}
        >
          <Tab eventKey="due" title="Due reviews">
            <Table>
             <tbody>
               {dueTasks.map(task => <DueTask
                                       taskDetails={{
                                           id: task.id,
                                           description: task.description,
                                           multiplier: task.multiplier
                                       }}
                                       value={task.title}
                                       dueDate={task.due_date}
                                       introDate={task.intro_date}
                                     />)}
             </tbody>
           </Table>
          </Tab>
          <Tab eventKey="upcoming" title="Upcoming reviews">
            <Table>
             <tbody>
               {upcomingTasks.map(task => <UpcomingTask
                                            taskDetails={{
                                                id: task.id,
                                                description: task.description,
                                                multiplier: task.multiplier
                                            }}
                                            value={task.title}
                                            dueDate={task.due_date}
                                            introDate={task.intro_date}
                                          />)}
             </tbody>
           </Table>
          </Tab>
          <Tab eventKey="inactive" title="Inactive reviews">
            <Table>
              <tbody>
                <InactiveTask />
              </tbody>
            </Table>
          </Tab>
          </Tabs>
    );
}
