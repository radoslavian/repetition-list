import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { useState, useReducer } from "react";
import { useAlerts, useTasksManager } from "../contexts";
import { Check, X } from "react-bootstrap-icons";
import { useApi } from "../contexts";

export default function TaskTitle({ taskDetails }) {
    const [clicked, setClicked] = useReducer(_clicked => !_clicked, false);
    const [title, setTitle] = useState(taskDetails.title);
    const handleTitleChange = e => setTitle(e.currentTarget.value);
    const { error } = useAlerts();
    const apiClient = useApi();
    const { updateTask } = useTasksManager();

    function cancel() {
        setClicked();
        setTitle(taskDetails.title);
    }

    async function save() {
        if (taskDetails.title === title) {
            setClicked();
            return;
        }
        const response = await apiClient
            .patch(`/task/${taskDetails.id}/update`, {title: title});
        if(!response.ok) {
            error(response.body.status);
        } else {
            setClicked();
            updateTask({title: title}, taskDetails.id);
        }
    }

    return (
        clicked || !taskDetails.id ?
        <InputGroup>
          <Form.Control
            data-testid="title-input"
            value={title}
            placeholder="Task title"
            onChange={handleTitleChange}
          />
          <Button
            variant="outline-info"
            title="save title"
            onClick={save}>
            <Check/>
          </Button>
          <Button
            title="cancel modifications"
            onClick={cancel}
            variant="outline-warning">
            <X/>
          </Button>
        </InputGroup>
        :
        <p
          onClick={setClicked}
          aria-label={title}
        >
          {title}
        </p>
    );
}
