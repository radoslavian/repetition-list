import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import NewTaskDetails from "./NewTaskDetails";
import DueDate from "./DueDate";
import { useState } from "react";
import { useAlerts, useApi } from "../contexts";
import { today } from "../utils.js";

function validateTaskData(taskData) {
    if(taskData.title === "") {
        throw new Error("Empty title");
    } else if(isNaN(taskData.multiplier)) {
        throw new TypeError("Multiplier is not a number");
    } else if(isNaN(Date.parse(taskData.due_date))) {
        throw new TypeError("Due date is not a number");
    } else if (new Date(taskData.due_date) < new Date()) {
        throw new Error("Task can't have assigned due date that is earlier "
                            + "than the current date.");
    }
}

export default function AddNewTask({ apiEndpoint, onSuccessAdd = f => f }) {
    const defaultMultiplicator = 1.2;
    const [title, updateTitle] = useState("");
    const [description, updateDescription] = useState("");
    const [intervalMultiplier, updateIntervalMult] = useState(
        defaultMultiplicator);
    const [date, updateDate] = useState(today(10));
    const { error, info } = useAlerts();
    const taskData = {title: title,
                      description: description,
                      multiplier: intervalMultiplier,
                      due_date: date};
    const apiClient = useApi();

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

    const onRequestSuccess = () => {
        clearForm();
        onSuccessAdd();
        info("Successfully added new task.");
    };

    function addBtClick(taskData,
                        onSuccess = m => m,
                        onFail = e => error(e.toString())) {
        return async () => {
            try {
                validateTaskData(taskData);
            } catch(e) {
                onFail(e.toString());
                return;
            }
            const response = await apiClient.post(apiEndpoint, taskData);

            if(response.ok) {
                onSuccess(response);
            } else {
                onFail(response.body.message);
            }
        };
    }

    return (
        <Container fluid data-testid="add-new-task">
          <h5 className="mt-2">Add new task:</h5>
          <Row>
            <Col className="pt-2 pr-0">
              <Form.Control
                value={title}
                placeholder="New task title"
                onChange={handleTitleChange}
              />
            </Col>
            <Col>
              <NewTaskDetails
                descriptionValue={description}
                intervalMultiplier={intervalMultiplier}
                onDescChange={handleDescChange}
                onMultiplierChange={handleMultiplierChange}
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
                onClick={addBtClick(
                    taskData, onRequestSuccess)}
              >+
              </Button>
            </Col>
          </Row>
        </Container>
    );
}
