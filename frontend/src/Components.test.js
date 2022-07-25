import { render, screen } from "@testing-library/react";
import App from "./App";

import TaskTitle from "./components/TaskTitle";

test("check TaskTitle component renders", () => {
    render(<TaskTitle />);
    const component = screen.getByText(/Task title:/);
    expect(component).toBeInTheDocument();
});

import EntryTaskDetails from "./components/NewTaskDetails";

test("check if NewTaskDetails renders", () => {
    render(<EntryTaskDetails testId="NewTaskDetails" />);
    const component = screen.getByTestId("NewTaskDetails");
    expect(component).toBeInTheDocument();
});

import TaskDescription from "./components/TaskDescription";

test("check TaskDescription renders", () => {
    render(<TaskDescription />);
    const component = screen.getByPlaceholderText("Detailed description…");
    expect(component).toBeInTheDocument();
});

import IntervalMultiplier from "./components/IntervalMultiplier";

test("check IntervalMultiplier renders", () => {
    render(<IntervalMultiplier />);
    const component = screen.getByText("Multiplier:");
    expect(component).toBeInTheDocument();
});

import AddNewTask from "./components/AddNewTask";

test("check AddNewTask renders", () => {
    render(<AddNewTask />);
    const component = screen.getByTestId("add-new-task");
    expect(component).toBeInTheDocument();
});

import DueDate from "./components/DueDate";

test("check DueDate renders", () => {
    render(<DueDate />);
    const component = screen.getByTitle("dueDate");
    expect(component).toBeInTheDocument();
});

import PreviousReviews from "./components/PreviousReviews";

test("check if PreviousReviews renders review history list", () => {
    const rows = [
        {date: "12.01.2024",
         multiplier: 1.4},
        {date: "18.01.2024",
         multiplier: 2.0},
        {date: "10.02.2024",
         multiplier: 1.2}
    ];
    render(<PreviousReviews reviewsData={rows} />);
    const component = screen.getByTestId("PreviousReviews");

    expect(component).toBeInTheDocument();

    // check if all entries from the rows were rendered
    expect(component.getElementsByTagName("tr").length).toBe(rows.length);

    // check if component has the text from the rows
    rows.map(row => Object.keys(row).map(
        key => expect(component).toHaveTextContent(row[key])));
});

import NewTaskDetails from "./components/NewTaskDetails.js";
import Button from "react-bootstrap/Button";

test("check if NewTaskDetails renders itself and children", () => {
    // how to get child component from the parent using query?
    render(
	<NewTaskDetails testId="parent">
          <Button data-testid="child" variant="primary">Primary</Button>
	</NewTaskDetails>
    );
    const parentComponent = screen.getByTestId("parent");
    const childComponent = screen.getByTestId("child");
    expect(parentComponent).toBeInTheDocument();
    expect(childComponent).toBeInTheDocument();
});

/*
<Button title="stopSchedulingTaskBt" />
          <Button title="resetTaskBt" />
*/

import TaskDetails from "./components/TaskDetails.js";

test("check if TaskDetails renders", () => {
    render(<TaskDetails/>);
    const stopSchedulingTaskBt = screen.getByTitle("stopSchedulingTaskBt");
    const resetTaskBt = screen.getByTitle("resetTaskBt");
    expect(stopSchedulingTaskBt).toBeInTheDocument();
    expect(resetTaskBt).toBeInTheDocument();
});

import InactiveTaskDetails from "./components/InactiveTaskDetails.js";

test("check if InactiveTaskDetails renders", () => {
    render(<InactiveTaskDetails testId="InactiveTaskDetails" />);
    expect(screen.getByTestId("InactiveTaskDetails")).toBeInTheDocument();
});

import DueTask from "./components/DueTask.js";
import Table from "react-bootstrap/Table";

test("check if TasksList with a DueTask child renders", () => {
    render(<Table>
             <tbody>
               <DueTask />
             </tbody>
           </Table>);
    expect(screen.getByText("Delete")).toBeInTheDocument();
});

import UpcomingTask from "./components/UpcomingTask.js";

test("check if UpcomingTask renders as a child of TasksList", () => {
    render(<Table>
             <tbody>
               <UpcomingTask />
             </tbody>
           </Table>);
    expect(screen.getByText(/Previous reviews/)).toBeInTheDocument();
});

import InactiveTask from "./components/InactiveTask.js";

test("check if InactiveTask renders as a table", () => {
    render(<Table>
             <tbody>
               <InactiveTask />
             </tbody>
           </Table>);
    expect(screen.getByText(
        "Reintroduce into queue")).toBeInTheDocument();
    expect(() => screen.getByText("Reset")).toThrow();
});

import TasksGroupSwitcher from "./components/TasksGroupSwitcher.js";

test("check if TasksGroupSwitcher renders", () => {
    render(<TasksGroupSwitcher/>);
    expect(screen.getByText("Inactive reviews")).toBeInTheDocument();
});
