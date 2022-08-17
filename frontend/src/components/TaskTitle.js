import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { useState, useReducer } from "react";
import { Check, X } from "react-bootstrap-icons";
import ApiClient from "../ApiClient";

async function _save(taskDetails, endpoint, update = f => f, onFail = f => f) {
    const apiClient = new ApiClient(endpoint);
    let response = await apiClient
          .patch(`/${taskDetails.id}/update`, taskDetails);
    if(!response.ok) {
        onFail(response);
        response = await apiClient.get(`/${taskDetails.id}`);
        update(response.body);
    }
}

const _taskDetails = {title: ""};

export default function TaskTitle(
    { onChange = f => f, taskDetails = _taskDetails, save = _save }) {
    const [clicked, setClicked] = useReducer(clicked_ => !clicked_);
    const [title, setTitle] = useState(taskDetails.title);
    const handleTitleChange = e => setTitle(e.currentTarget.value);
    const cancel = () => setTitle(taskDetails.title);
    const updateTitle = (data) => setTitle(data.title);

    return (
        clicked || !taskDetails.id ?
        <InputGroup>
          <Form.Control
            value={title}
            placeholder="Task title"
            onChange={handleTitleChange}
          />
          <Button variant="outline-info"
                  onClick={() => {
                      save({...taskDetails, title: title},
                           "/v1/task", updateTitle);
                      setClicked();
                  }}>
            <Check/>
          </Button>
          <Button onClick={() => {
              setClicked();
              cancel();
          }}
                  variant="outline-warning">
            <X/>
          </Button>
        </InputGroup>
        :
        <p onClick={setClicked}>
          {title}
        </p>
    );
}
