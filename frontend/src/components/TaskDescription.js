import Form from "react-bootstrap/Form";

// uncomment this and further down the code - when exporting into production
// import ReactMarkdown from "react-markdown";
import { useReducer, useState } from "react";
import Button from "react-bootstrap/Button";

export default function TaskDescription({ onChange = f => f, value = "" }) {
    const [edit, setEdit] = useReducer(edit_ => !edit_, false);

    return (
        edit ?
	    <Form.Control
              autoFocus
              as="textarea"
              rows="4"
              value={value}
              placeholder="Detailed description&hellip;"
              onChange={onChange}
              onBlur={setEdit}
            />
        :
        <p>
          {/* <ReactMarkdown>{value}</ReactMarkdown> */}
          {value}
          <Button
            onClick={setEdit}
            variant="outline-secondary"
            size="sm"
          >
            {value ? "Edit" : "Description..."}
          </Button>
        </p>
    );
}
