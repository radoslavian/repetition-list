import InputGroup from "react-bootstrap/InputGroup";
import TaskDescription from "./TaskDescription";
import IntervalMultiplier from "./IntervalMultiplier";
import Collapse from "react-bootstrap/Collapse";
import Card from "react-bootstrap/Card";
import { useState } from "react";

export default function NewTaskDetails(
    { onDescChange, onMultiplierChange, testId, intervalMultiplier,
      descriptionValue = "", children }) {
    const [open, setOpen] = useState(false);

    return (
        <>
          <a
            href="#"
            className="link-secondary"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
          >
            Details&hellip;
          </a>
          <Collapse in={open}>
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
