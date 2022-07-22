import Button from "react-bootstrap/Button";
import NewTaskDetails from "./NewTaskDetails.js";

export default function InactiveTaskDetails() {
    return (
	<NewTaskDetails data-testid="InactiveTaskDetails">
          <Button
            variant="info">
            Reintroduce&nbsp;into&nbsp;queue
          </Button>
        </NewTaskDetails>
    );
}
