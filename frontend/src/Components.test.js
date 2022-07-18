import { render, screen } from "@testing-library/react";
import App from "./App";

import TaskTitle from "./components/TaskTitle";

test("check TaskTitle component renders", () => {
    render(<TaskTitle />);
    const component = screen.getByText(/Task title:/);
    expect(component).toBeInTheDocument();
});

import EntryTaskDetails from "./components/NewTaskDetails";

test("check NewTaskDetails renders", () => {
    render(<EntryTaskDetails />);
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

/*
import CurrentTask from "./components/CurrentTask";

test("check if CurrentTask renders", () => {
    render(<CurrentTask />);
    const component = screen.getByTestId("currentTask");
    expect(component).toBeInTheDocument();
});
*/
