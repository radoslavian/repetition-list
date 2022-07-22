import InputGroup from "react-bootstrap/InputGroup";
import Accordion from "react-bootstrap/Accordion";
import TaskDescription from "./TaskDescription";
import IntervalMultiplier from "./IntervalMultiplier";

export default function NewTaskDetails(props) {
    return (
        <Accordion data-testid={props["data-testid"]}>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Details&hellip;</Accordion.Header>
            <Accordion.Body>
              <InputGroup data-testid="NewTaskDetails">
                <TaskDescription />
                <IntervalMultiplier />
                {props.children}
              </InputGroup>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
    );
}
