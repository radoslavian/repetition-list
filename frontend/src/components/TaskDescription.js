import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function TaskDescription() {
    return (
	<Form.Control as="textarea" rows="4" placeholder="Detailed description&hellip;" />
    );
}
