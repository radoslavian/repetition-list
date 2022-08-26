import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { useState, useReducer, useContext } from "react";
import { useAlerts } from "../contexts";
import { Check, X } from "react-bootstrap-icons";
import ApiClient from "../ApiClient";

export default function TaskTitle({ taskDetails }) {
    const [clicked, setClicked] = useReducer(_clicked => !_clicked);
    const [title, setTitle] = useState(taskDetails.title);
    const handleTitleChange = e => setTitle(e.currentTarget.value);
    const { error } = useAlerts();

    async function save(details, onFail = f => f, onSuccess = f => f) {
        const apiClient = new ApiClient("/v1/task");
        let response = await apiClient
            .patch(`/${details.id}/update`, details);
        if(!response.ok) {
            onFail(response);
        } else {
            onSuccess();
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
            onClick={
                () => save({...taskDetails, title: title},
                           response => {
                               error(response.body.status);
                               setTitle(taskDetails.title);
                           },  // onFail
                           () => setClicked()  // onSuccess
                          )
            }>
            <Check/>
          </Button>
          <Button
            title="cancel modifications"
            onClick={() => {
              setClicked();
              setTitle(taskDetails.title);
          }}
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
