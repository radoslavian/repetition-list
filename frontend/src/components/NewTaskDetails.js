import InputGroup from "react-bootstrap/InputGroup";
import TaskDescription from "./TaskDescription";
import IntervalMultiplier from "./IntervalMultiplier";
import Collapse from "react-bootstrap/Collapse";
import Card from "react-bootstrap/Card";
import { useState } from "react";

export default function NewTaskDetails(
    { onDescChange, onMultiplierChange, intervalMultiplier,
      descriptionValue = "", children }) {
    const [opened, setOpened] = useState(false);

    return (
        <>
          <a
            href="#"
            className="link-secondary"
            onClick={() => setOpened(!opened)}
            aria-expanded={opened}
          >
            Details&hellip;
          </a>
          <Collapse in={opened}>
            <Card.Body>
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
          </Collapse>
        </>
    );
}
