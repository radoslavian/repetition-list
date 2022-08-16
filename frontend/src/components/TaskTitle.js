import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { useReducer } from "react";
import { Check, X } from "react-bootstrap-icons";

export default function TaskTitle({ onChange, value }) {
    const [clicked, setClicked] = useReducer(clicked_ => !clicked_);
    
    return (
        clicked ? 
        <InputGroup>
          <Form.Control
            value={value}
            placeholder="Task title"
            onChange={onChange}/>
          <Button variant="outline-info">
            <Check/>
          </Button>
          <Button onClick={setClicked}
                  variant="outline-warning">
            <X/>
          </Button>
        </InputGroup>
        :
        <p onClick={setClicked}>
          {value}
        </p>
    );
}
