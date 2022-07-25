import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import TaskTitle from "./TaskTitle";
import NewTaskDetails from "./NewTaskDetails";
import DueDate from "./DueDate";
import { useState } from "react";
import { today } from "../utils.js";
import ApiClient from "../ApiClient.js";

function validateTaskData(taskData) {
    if(taskData.title === "") {
        throw "Empty title";
    } else if(isNaN(taskData.multiplier)) {
        throw "Multiplier is not a number";
    } else if(isNaN(Date.parse(taskData.due_date))) {
        throw "Due date is not a number";
    }
}

function addBtClick(taskData,
                    onSuccess = m => console.log(m),
                    onFail = e => console.error(e)) {
    return async () => {
        try {
            validateTaskData(taskData);
        } catch(error) {
            onFail(error);
            return;
        }
        const apiClient = new ApiClient();
        const response = await apiClient.post("/add-task", taskData);

        if(response.ok) {
            onSuccess(response);
        } else {
            onFail(response);
        }
    };
}

export default function AddNewTask({ apiEndpoint }) {
    const defaultMultiplicator = 1.2;
    const [title, updateTitle] = useState("");
    const [description, updateDescription] = useState("");
    const [intervalMultiplier, updateIntervalMult] = useState(defaultMultiplicator);
    const [date, updateDate] = useState(today(10));
    const taskData = {title: title,
                      description: description,
                      multiplier: intervalMultiplier,
                      due_date: date};

    const handleTitleChange = e => updateTitle(e.currentTarget.value);
    const handleDescChange = e => updateDescription(e.currentTarget.value);
    const handleMultiplierChange = e => updateIntervalMult(
        e.currentTarget.value);
    const handleDateChange = e => updateDate(e.currentTarget.value);
    const clearForm = () => {
        updateTitle("");
        updateDescription("");
        updateIntervalMult(defaultMultiplicator);
    };
    const onRequestSuccess = m => {
        clearForm();
        console.log(m);
    };

    return (
        <Container fluid data-testid="add-new-task">
          <h5>Add new task:</h5>
          <Row>
            <Col className="pt-2 pr-0">
              <TaskTitle value={title} onChange={handleTitleChange} />
            </Col>
            <Col>
              <NewTaskDetails
                descriptionValue={description}
                onDescChange={handleDescChange}
                onMultiplierChange={handleMultiplierChange}
                intervalMultiplier={intervalMultiplier}
              />
            </Col>
            <Col>
              <DueDate
                value={date}
                onChange={handleDateChange}
              />
            </Col>
            <Col>
              <Button
                variant="info"
                onClick={addBtClick(taskData, onRequestSuccess)}
              >+
              </Button>
            </Col>
          </Row>
        </Container>
    );
}
