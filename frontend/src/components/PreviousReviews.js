import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";
import { useState, useEffect } from "react";
import ApiClient from "../ApiClient";

export default function PreviousReviews({ taskId, apiEndpoint }) {
    const [reviewsData, setReviewsData] = useState([]);
    const [open, setOpen] = useState(false);

    function loadData() {
        if(!open){ return }
        const apiClient = new ApiClient(apiEndpoint);
        apiClient.get(`/${taskId}/reviews`)
            .then(response => setReviewsData(response.body));
    }
    useEffect(() => loadData(), [open]);

    return (
        <Accordion defaultActiveKey="0">
          <Accordion.Item>
            <Accordion.Header onClick={() => setOpen(!open)}>
            Previous reviews
          </Accordion.Header>
            <Accordion.Collapse in={open} dimension="height">
            <Table data-testid="PreviousReviews">
              <tbody>
                <tr><th>Due&nbsp;date:</th><th>Multiplier:</th></tr>
                {reviewsData.map(
                    (row, i) => <tr key={`rev-${i}`}>
                                  <td>
                                    {new Date(row.prev_due_date)
                                     .toISOString().split("T")[0]}
                                  </td>
                                  <td>{row.multiplier}</td>
                                </tr>)}
              </tbody>
            </Table>
        </Accordion.Collapse>
        </Accordion.Item>
        </Accordion>
    );
}
