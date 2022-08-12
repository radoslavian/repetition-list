/*
import PreviousReviews from "./PreviousReviews.js";
import TaskDetails from "./TaskDetails.js";
import TaskTitle from "./TaskTitle.js";
import { useState, useCallback } from "react";
import { getOnChange, deleteTask, tickOff } from "../utils.js";
*/
import Button from "react-bootstrap/Button";
import { tickOff } from "../utils.js";
import Task from "./Task.js";

export default function DueTask(
    { taskDetails, toggleUpdate = f => f, apiEndpoint = "/v1/task/" }) {

    return (
        <>
          <td>
            <Button onClick={() => tickOff(
                taskDetails.id, apiEndpoint, toggleUpdate)}
            >✓</Button>
          </td>
          <Task
            taskDetails={taskDetails}
            toggleUpdate={toggleUpdate}
            apiEndpoint={apiEndpoint}
          />
        </>
    );
}
