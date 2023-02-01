import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import NewTaskDetails from "./NewTaskDetails";
import DueDate from "./DueDate";
import { useState } from "react";
import { useAlerts, useApi, useTasksManager } from "../contexts";
import { today } from "../utils.js";

function validateTaskData(taskData) {
    if(taskData.title === "") {
        throw new Error("Empty title");
    } else if(isNaN(taskData.multiplier)) {
        throw new TypeError("Multiplier is not a number");
    } else if(isNaN(Date.parse(taskData.due_date))) {
        throw new TypeError("Due date is not a number");
    } else if (new Date(taskData.due_date) < new Date()) {
        throw new Error("Due date has to be set at "
                        + "least one day from today.");
    }
}

export default function AddNewTask({ apiEndpoint }) {
    const defaultMultiplier = 1.2;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [title, updateTitle] = useState("");
    const [description, updateDescription] = useState("");
    const [intervalMultiplier, updateIntervalMult] = useState(
        defaultMultiplier);
    const [date, updateDate] = useState(today(10));
    const { error, info } = useAlerts();
    const taskData = {title: title,
                      description: description,
                      multiplier: intervalMultiplier,
                      due_date: date};
    const apiClient = useApi();
    const { addTask } = useTasksManager();

    const handleTitleChange = e => updateTitle(e.currentTarget.value);
    const handleDescChange = e => updateDescription(e.currentTarget.value);
    const handleMultiplierChange = e => updateIntervalMult(
        e.currentTarget.value);
    const handleDateChange = e => updateDate(e.currentTarget.value);
    function clearForm() {
        updateTitle("");
        updateDescription("");
        updateIntervalMult(defaultMultiplier);
    }

    const onRequestSuccess = response => {
        const newTask = {...taskData,
                         active: true,
                         id: response.body.taskId,
                         intro_date: today()};
        addTask(newTask);
        clearForm();
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
                handleClose();
            } else {
                onFail(response.body.message);
            }
        };
    }

    // test: closing window

    return (
        <>
          <Button variant="success" onClick={handleShow}>
            Add&nbsp;new&nbsp;task
          </Button>

          <Modal
            show={show}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            data-testid="add-new-task"
            centered
          >
            <Modal.Header closeButton>
              Add new task:
            </Modal.Header>
            <Modal.Body>
              <Form.Control
                value={title}
                placeholder="New task title"
                onChange={handleTitleChange}
              />
              <NewTaskDetails
                descriptionValue={description}
                intervalMultiplier={intervalMultiplier}
                onDescChange={handleDescChange}
                onMultiplierChange={handleMultiplierChange}
              />
              <DueDate
                value={date}
                onChange={handleDateChange}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="info"
                onClick={addBtClick(taskData, onRequestSuccess)}
              >
                Add&nbsp;&&nbsp;close
              </Button>
            </Modal.Footer>
          </Modal>
        </>
    );
}
