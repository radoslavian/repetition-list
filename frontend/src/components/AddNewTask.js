import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TaskTitle from "./TaskTitle";
import NewTaskDetails from "./NewTaskDetails";
import DueDate from "./DueDate";

export default function AddNewTask() {
    return (
        <Container fluid data-testid="add-new-task">
          <h5>Add new task:</h5>
          <Row>
            <Col className="pt-2 pr-0"><TaskTitle /></Col>
            <Col><NewTaskDetails /></Col>
            <Col><DueDate /></Col>
            <Col><Button variant="info">+</Button></Col>
          </Row>
        </Container>
    );
}
