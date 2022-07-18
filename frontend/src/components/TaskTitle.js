import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function TaskTitle({ title }) {
    return (
        <InputGroup>
          <InputGroup.Text>Task title:</InputGroup.Text>
          <Form.Control
            name="title"
            placeholder={title}
          />
        </InputGroup>
    );
}
