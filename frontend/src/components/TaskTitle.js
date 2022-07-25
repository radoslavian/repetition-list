import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function TaskTitle({ title, onChange, value }) {
    return (
          <InputGroup>
            <InputGroup.Text>Task title:</InputGroup.Text>
            <Form.Control
              value={value}
              name="title"
              placeholder="Task title"
              onChange={onChange}
            />
        </InputGroup>
    );
}
