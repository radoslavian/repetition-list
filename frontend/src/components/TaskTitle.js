import Form from "react-bootstrap/Form";

export default function TaskTitle({ onChange, value }) {
    return (
            <Form.Control
              value={value}
              placeholder="Task title"
              onChange={onChange}
            />
    );
}
