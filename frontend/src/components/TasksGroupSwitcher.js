import Table from "react-bootstrap/Table";
import DueTask from "./DueTask.js";
import InactiveTask from "./InactiveTask.js";
import UpcomingTask from "./UpcomingTask.js";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { useState } from "react";

export default function TaskGroupSwitcher(props) {
    const [key, setKey] = useState("due");

    return (
        <Tabs
          id="tasks-group-switcher"
          activeKey={key}
          onSelect={k => setKey(k)}
        >
          <Tab eventKey="due" title="Due reviews">
            <Table>
             <tbody>
               <DueTask />
             </tbody>
           </Table>
          </Tab>
          <Tab eventKey="upcoming" title="Upcoming reviews">
            <Table>
             <tbody>
               <UpcomingTask />
             </tbody>
           </Table>
          </Tab>
          <Tab eventKey="inactive" title="Inactive reviews">
            <Table>
              <tbody>
                <InactiveTask />
              </tbody>
            </Table>
          </Tab>
          </Tabs>
    );
}
