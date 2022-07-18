import InputGroup from "react-bootstrap/InputGroup";
import Accordion from "react-bootstrap/Accordion";
import TaskDescription from "./TaskDescription";
import IntervalMultiplier from "./IntervalMultiplier";

export default function NewTaskDetails() {
    return (
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Details&hellip;</Accordion.Header>
            <Accordion.Body>
              <InputGroup data-testid="NewTaskDetails">
                <TaskDescription />
                <IntervalMultiplier />
              </InputGroup>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
    );
}
