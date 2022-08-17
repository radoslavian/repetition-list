import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useState } from "react";

export default function IntervalMultiplier({ onChange, value }) {
    const _value = parseFloat(value);
    return (
        <InputGroup>
          <Form.Text>Multiplier:&nbsp;<b>{value}</b></Form.Text>
          <Form.Range
            min="1.0"
            max="10.0"
            step="0.2"
            value={_value.toFixed(2)}
            onChange={onChange}
          />
        </InputGroup>
    );
}
