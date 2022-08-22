import Table from "react-bootstrap/Table";
import { useState, useEffect } from "react";
import Collapse from "react-bootstrap/Collapse";
import Card from "react-bootstrap/Card";
import ApiClient from "../ApiClient";

export default function PreviousReviews({ taskId, apiEndpoint, expanded = false }) {
    const [reviewsData, setReviewsData] = useState([]);
    const [open, setOpen] = useState(expanded);

    function loadData() {
        if(!open){ return; }
        const apiClient = new ApiClient(apiEndpoint);
        apiClient.get(`/${taskId}/reviews`)
            .then(response => setReviewsData(response.body));
    }
    useEffect(() => loadData(), [open]);

    return (
        <>
          <a
            className="link-secondary"
            href="#" onClick={() => setOpen(!open)}
             aria-expanded={open}
          >
            Previous&nbsp;reviews&hellip;
          </a>
          <Collapse in={open}>
            <Card.Body>
              <Table data-testid="PreviousReviews">
                <tbody>
                  <tr><th>Due:</th><th>Multiplier:</th></tr>
                  {reviewsData.map(
                      (row, i) => <tr key={`rev-${i}`}>
                                    <td title="Due date">
                                      {new Date(row.prev_due_date)
                                       .toISOString().split("T")[0]}
                                    </td>
                                    <td title="Multiplier">
                                      {row.multiplier}
                                    </td>
                                  </tr>)}
                </tbody>
              </Table>
            </Card.Body>
          </Collapse>
        </>
    );
}
