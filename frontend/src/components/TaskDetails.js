import Button from "react-bootstrap/Button";
import NewTaskDetails from "./NewTaskDetails.js";

export default function TaskDetails() {
    return (
        <NewTaskDetails>
          <Button
            variant="primary"
            title="stopSchedulingTaskBt">
            Stop&nbsp;scheduling
          </Button>
          <Button
            variant="warning"
            title="resetTaskBt">
            Reset
          </Button>
        </NewTaskDetails>
    );
}
