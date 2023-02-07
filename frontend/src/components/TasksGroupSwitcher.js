import Table from "react-bootstrap/Table";
import DueTask from "./DueTask.js";
import Task from "./Task.js";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import { sortDate } from "../utils";
import { useState } from "react";

function renderTasksHeader(header) {
    return tasks => {
        /* Conditionally returns header for a given tasks list
         * (which currently is a table). */

        if(tasks.length > 0)
            return header;
        return (
            <Row>
              <Col>
                <h6>No review tasks on this list.</h6>
              </Col>
            </Row>
        );
    };
}

export default function TaskGroupSwitcher({ allTasks = [] }) {
    const [key, setKey] = useState("due");
    const [dueTasks, upcomingTasks, inactiveTasks] = [
        allTasks.filter(
            task => new Date(task.due_date) <= new Date() && task.active),
        allTasks.filter(
            task => new Date(task.due_date) > new Date() && task.active),
        allTasks.filter(task => !task.active)
    ].map(arr => arr.sort(sortDate));

    const hashHeaderColWidth = 1;
    const titleHeaderColWidth = 6;
    const dueDateHeaderColWidth = 2;
    const introDateHeaderColWidth = 2;

    const dueTasksHeader = renderTasksHeader(
        <Row className="border-bottom m-2">
          <Col className="text-end" xs={hashHeaderColWidth}>
            <h5>#</h5>
          </Col>
          <Col xs={titleHeaderColWidth}>
            <h6>Task title</h6>
          </Col>
          <Col xs={dueDateHeaderColWidth} className="d-none d-lg-block">
            <h6>Due date</h6>
          </Col>
          <Col xs={introDateHeaderColWidth} className="d-none d-lg-block">
            <h6>Introduction date</h6>
          </Col>
        </Row>
    );
    const tasksHeader = renderTasksHeader(
        <Row className="border-bottom m-2">
          <Col xs={titleHeaderColWidth}>
            <h6>Task title</h6>
          </Col>
          <Col xs={dueDateHeaderColWidth} className="d-none d-lg-block">
            <h6>Due date</h6>
          </Col>
          <Col xs={introDateHeaderColWidth} className="d-none d-lg-block">
            <h6>Introduction date</h6>
          </Col>
        </Row>
    );

    return (
        <Tabs
          id="tasks-group-switcher"
          activeKey={key}
          onSelect={k => setKey(k)}
          className="mt m-3"
        >
          <Tab eventKey="due" title="Due reviews">
            <Container
              fluid
              data-testid="due-tasks-table"
            >
              {dueTasksHeader(dueTasks)}
              {dueTasks.map(task => (
                  <Row className="border-bottom p-1" key={`a${task.id}`}>
                    <DueTask taskDetails={task}/>
                  </Row>))}
            </Container>
          </Tab>
          <Tab eventKey="upcoming" title="Upcoming reviews">
            <Container
              fluid
              data-testid="upcoming-tasks-list"
            >
              {tasksHeader(upcomingTasks)}
              {upcomingTasks.map((task, i) => (
                  <Row className="border-bottom p- 1" key={`b${task.id}`}>
                    <Task taskDetails={task}/>
                  </Row>))}
           </Container>
          </Tab>
          <Tab eventKey="inactive" title="Inactive reviews">
            <Container fluid>
              {tasksHeader(inactiveTasks)}
              {inactiveTasks.map((task, i) => (
                  <Row className="border-bottom p-1" key={`c${task.id}`}>
                    <Task taskDetails={task}/>
                  </Row>))}
            </Container>
          </Tab>
        </Tabs>
    );
}
