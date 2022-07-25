import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function IntervalMultiplier({ onChange, value }) {
    return (
        <InputGroup>
          <InputGroup.Text>Multiplier:</InputGroup.Text>
          <Form.Control
            value={value}
            title="multiplier-input"
            onChange={onChange}
          />
        </InputGroup>
    );
}
