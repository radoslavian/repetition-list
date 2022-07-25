import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function TaskDescription({ onChange, value }) {
    return (
	<Form.Control
          as="textarea"
          rows="4"
          value={value}
          placeholder="Detailed description&hellip;"
          onChange={onChange}
        />
    );
}
