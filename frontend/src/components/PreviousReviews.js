import Table from "react-bootstrap/Table";
import Accordion from "react-bootstrap/Accordion";

export default function PreviousReviews({ reviewsData = []}) {
    return (
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>Previous reviews:</Accordion.Header>
            <Accordion.Body>
              <Table data-testid="PreviousReviews">
                <tbody>
                  {reviewsData.map(
                      (row, i) => <tr key={i}>
                                    <td>{row.date}</td>
                                    <td>{row.multiplier}</td>
                                  </tr>)}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
    );
}
