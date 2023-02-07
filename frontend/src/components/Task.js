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

    return (
        <>
          <DeleteTaskDialog
            show={deleteModalShow}
            setShow={setDeleteModalShow}
            taskDetails={taskDetails}
          />
          <Col xs={6} lg={3} className="ml-5">
            <TaskTitle taskDetails={taskDetails}/>
          </Col>
          <Col xs={3}>
            <TaskDetailsModal taskDetails={taskDetails}/>
          </Col>
          <Col xs={2} className="d-none d-lg-block">
            {taskDetails.due_date}
          </Col>
          <Col xs={2} className="d-none d-lg-block">
            {taskDetails.intro_date}
          </Col>
          <Col xs={1}>
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
