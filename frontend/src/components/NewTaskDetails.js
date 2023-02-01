import InputGroup from "react-bootstrap/InputGroup";
import TaskDescription from "./TaskDescription";
import IntervalMultiplier from "./IntervalMultiplier";
import Card from "react-bootstrap/Card";

export default function NewTaskDetails(
    { onDescChange, onMultiplierChange, intervalMultiplier,
      descriptionValue = "", children }) {

    return (
        <>
          <Card.Body data-testid="new-task-details">
            <InputGroup>
              <TaskDescription
                value={descriptionValue}
                onChange={onDescChange}
              />
              <IntervalMultiplier
                value={intervalMultiplier}
                onChange={onMultiplierChange}
              />
              {children}
            </InputGroup>
          </Card.Body>
        </>
    );
}
