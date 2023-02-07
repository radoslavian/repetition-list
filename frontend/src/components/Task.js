import TaskTitle from "./TaskTitle.js";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import DeleteTaskDialog from "./DeleteTaskDialog.js";
import { Trash } from "react-bootstrap-icons";
import Col from 'react-bootstrap/Col';
import TaskDetailsModal from "./TaskDetailsModal.js";

export default function Task({ taskDetails }) {
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const handleShow = () => setDeleteModalShow(true);

    const titleColWidth = 6;
    const taskDetailsColWidth = 3;
    const dueDateColWidth = 2;
    const introDateColWidth = 2;
    const delButtonColWidth = 1;

    return (
        <>
          <DeleteTaskDialog
            show={deleteModalShow}
            setShow={setDeleteModalShow}
            taskDetails={taskDetails}
          />
          <Col xs={titleColWidth} lg={3} className="ml-5">
            <TaskTitle taskDetails={taskDetails}/>
          </Col>
          <Col xs={taskDetailsColWidth}>
            <TaskDetailsModal taskDetails={taskDetails}/>
          </Col>
          <Col xs={dueDateColWidth} className="d-none d-lg-block">
            {taskDetails.due_date}
          </Col>
          <Col xs={introDateColWidth} className="d-none d-lg-block">
            {taskDetails.intro_date}
          </Col>
          <Col xs={delButtonColWidth}>
            <Button
              variant="danger"
              aria-label="delete"
              onClick={handleShow}
            >
              <Trash/>
            </Button>
          </Col>
        </>
    );
}
