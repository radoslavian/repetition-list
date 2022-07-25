import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function DueDate({ onChange, value }) {
    return (
        <InputGroup>
          <InputGroup.Text>Due date:</InputGroup.Text>
          <Form.Control
            type="date"
            title="dueDate"
            onChange={onChange}
            value={value}
          />
        </InputGroup>
    );
}
