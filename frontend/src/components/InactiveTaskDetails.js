import Button from "react-bootstrap/Button";
import NewTaskDetails from "./NewTaskDetails.js";

export default function InactiveTaskDetails(props) {
    return (
	<NewTaskDetails {...props}>
          <Button
            variant="info">
            Reintroduce&nbsp;into&nbsp;queue
          </Button>
        </NewTaskDetails>
    );
}
