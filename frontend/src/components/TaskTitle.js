import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { useState, useReducer } from "react";
import { useAlerts } from "../contexts";
import { Check, X } from "react-bootstrap-icons";
import { useApi } from "../contexts";

export default function TaskTitle({ taskDetails }) {
    const [clicked, setClicked] = useReducer(_clicked => !_clicked);
    const [title, setTitle] = useState(taskDetails.title);
    const [editTitle, setEditedTitle] = useState(taskDetails.title);
    const handleTitleChange = e => setEditedTitle(e.currentTarget.value);
    const { error } = useAlerts();
    const apiClient = useApi();

    function cancel() {
        setClicked();
        setTitle(title);
        setEditedTitle(title);
    }

    async function save() {
        if (editTitle === title) {
            setClicked();
            return;
        }
        let response = await apiClient
            .patch(`/task/${taskDetails.id}/update`, {title: editTitle});
        if(!response.ok) {
            error(response.body.status);
        } else {
            setClicked();
            setTitle(editTitle);
        }
    }

    return (
        clicked || !taskDetails.id ?
        <InputGroup>
          <Form.Control
            data-testid="title-input"
            value={editTitle}
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
