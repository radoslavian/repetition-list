import InputGroup from "react-bootstrap/InputGroup";
import Accordion from "react-bootstrap/Accordion";
import TaskDescription from "./TaskDescription";
import IntervalMultiplier from "./IntervalMultiplier";

export default function NewTaskDetails(
    { onDescChange, onMultiplierChange, testId, intervalMultiplier,
      descriptionValue = "", children }) {

    return (
        <Accordion data-testid={testId}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Details&hellip;</Accordion.Header>
            <Accordion.Body>
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
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
    );
}
