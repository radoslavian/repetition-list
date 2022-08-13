import Table from "react-bootstrap/Table";
import DueTask from "./DueTask.js";
import Task from "./Task.js";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useState } from "react";

function renderTasksHeader(header) {
    return tasks => {
        /* Conditionally returns header for a given tasks list. */

        if(tasks.length > 0)
            return header;
        return (
            <tr>
              <td>
                <h6>No review tasks on this list.</h6>
              </td>
            </tr>
        );
    };
}

export default function TaskGroupSwitcher({ allTasks = [], toggleUpdate }) {
    const [key, setKey] = useState("due");
    const dueTasks = allTasks.filter(
        task => new Date(task.due_date) <= new Date() && task.active)
          .reverse();
    const upcomingTasks = allTasks.filter(
        task => new Date(task.due_date) > new Date() && task.active)
          .reverse();
    const inactiveTasks = allTasks.filter(task => !task.active);

    const dueTasksHeader = renderTasksHeader(
        <tr>
          <th>#</th>
          <th colSpan="2">Task title</th>
          <th>Due date</th>
          <th colSpan="3">Introduction date</th>
        </tr>
    );
    const tasksHeader = renderTasksHeader(
        <tr>
          <th colSpan="2">Task title</th>
          <th>Due date</th>
          <th colSpan="3">Introduction date</th>
        </tr>
    );

    return (
        <Tabs
          id="tasks-group-switcher"
          activeKey={key}
          onSelect={k => setKey(k)}
          className="mt m-3"
        >
          <Tab eventKey="due" title="Due reviews">
            <Table>
              <tbody>
                {dueTasksHeader(dueTasks)}
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
                {tasksHeader(upcomingTasks)}
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
                {tasksHeader(inactiveTasks)}
                {inactiveTasks.map((task, i) => (
                    <tr key={`c${task.id}`}>
                      <Task
                        taskDetails={task}
                        toggleUpdate={toggleUpdate}
                      />
                    </tr>))}
              </tbody>
            </Table>
          </Tab>
        </Tabs>
    );
}
