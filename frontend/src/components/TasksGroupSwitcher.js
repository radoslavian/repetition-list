import Table from "react-bootstrap/Table";
import DueTask from "./DueTask.js";
import Task from "./Task.js";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useState } from "react";

export default function TaskGroupSwitcher({ allTasks = [], toggleUpdate }) {
    const [key, setKey] = useState("due");
    const dueTasks = allTasks.filter(
        task => new Date(task.due_date) <= new Date() && task.active)
          .reverse();
    const upcomingTasks = allTasks.filter(
        task => new Date(task.due_date) > new Date() && task.active)
          .reverse();
    const inactiveTasks = allTasks.filter(task => !task.active);

    return (
        <Tabs
          id="tasks-group-switcher"
          activeKey={key}
          onSelect={k => setKey(k)}
        >
          <Tab eventKey="due" title="Due reviews">
            <Table>
              <tbody>
                {dueTasks.map(task => (
                    <tr key={`a${task.id}`}>
                      <DueTask
                        taskDetails={task}
                        toggleUpdate={toggleUpdate}
                      />
                    </tr>))}
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="upcoming" title="Upcoming reviews">
            <Table>
              <tbody>
                  {upcomingTasks.map((task, i) => (
                      <tr key={`b${task.id}`}>
                        <Task
                          taskDetails={task}
                          toggleUpdate={toggleUpdate}
                        />
                        </tr>))}
             </tbody>
           </Table>
          </Tab>
          <Tab eventKey="inactive" title="Inactive reviews">
            <Table>
              <tbody>
                {inactiveTasks.map((task, i) => (
                    <tr>
                      <Task
                        taskDetails={task}
                        key={`c${task.id}`}
                        toggleUpdate={toggleUpdate}
                      />
                    </tr>))}
              </tbody>
            </Table>
          </Tab>
        </Tabs>
    );
}
