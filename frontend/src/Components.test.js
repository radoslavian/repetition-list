import { render, screen, waitFor } from "@testing-library/react";
import { AlertProvider } from "./contexts";
import App from "./App";
import PreviousReviews from "./components/PreviousReviews";
import fetchMock from "fetch-mock-jest";

test("if PreviousReviews renders review history list", async () => {
    const rows = [
        {
            "multiplier": 1.0, 
            "prev_due_date": "Wed, 15 Aug 2022 00:00:00 GMT", 
            "reviewed_on": "Wed, 16 Aug 2022 00:00:00 GMT"
        },
        {
            "multiplier": 2.0,
            "prev_due_date": "Wed, 16 Aug 2022 00:00:00 GMT", 
            "reviewed_on": "Wed, 17 Aug 2022 00:00:00 GMT"
        },
        {
            "multiplier": 3.0, 
            "prev_due_date": "Wed, 18 Aug 2022 00:00:00 GMT", 
            "reviewed_on": "Wed, 19 Aug 2022 00:00:00 GMT"
        }
    ];
    const response = {body: rows};
    fetchMock
        .get("http://localhost:3000/v1/task/1/reviews",
             JSON.stringify(rows))
        .get("http://localhost:3000/v1/tasks",
             JSON.stringify([]));
    // this way the "test was not wrapped in act(...)" message
    // no longer appears
    waitFor(() => render(<PreviousReviews
                           taskId="1" apiEndpoint="/v1/task/"
                           expanded={true} />));
    const component = await screen.findByTestId("PreviousReviews");
    expect(component).toBeInTheDocument();

    // wait for actual previous due date rows to appear
    // - otherwise would count <tr>s after appearing
    // of the header (also wrapped in the <tr>)
    await waitFor(async () => expect(component)
                  .toHaveTextContent(
                      new Date("Wed, 18 Aug 2022 00:00:00 GMT")
                          .toISOString().split("T")[0]));

    const rowsNumber = component.getElementsByTagName("tr").length;
    expect(rowsNumber).toBe(rows.length + 1);  // one for the header

    // check if component has all the due-dates text from the rows
    rows.map(row => expect(component)
             .toHaveTextContent(new Date(row.prev_due_date)
                                .toISOString().split("T")[0]));
});

test("check if App rendering doesn't run into exceptions", () => {
    // this should be expanded
    render(
        <AlertProvider>
          <App/>
        </AlertProvider>
    );
});

import TaskTitle from "./components/TaskTitle";

test("check TaskTitle component renders", () => {
    const taskDetails = {
        due_date: "2022-11-19",
        id: 1,
        title: "test title",
        active: true
    };

    render(
        <AlertProvider>
          <TaskTitle taskDetails={taskDetails}/>
        </AlertProvider>
    );
    const component = screen.getByText("test title");
    expect(component).toBeInTheDocument();
});

import NewTaskDetails from "./components/NewTaskDetails";
import { useState } from "react";

test("check if NewTaskDetails renders", () => {
    render(<NewTaskDetails />);
    expect(screen.getByText("Description...")).toBeInTheDocument();
    expect(screen.getByText("Multiplier:")).toBeInTheDocument();
});

import TaskDescription from "./components/TaskDescription";

test("check if empty TaskDescription renders", () => {
    render(<TaskDescription />);
    const component = screen.getByText("Description...");
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
    render(<AlertProvider>
             <AddNewTask />
           </AlertProvider>);
    const component = screen.getByTestId("add-new-task");
    expect(component).toBeInTheDocument();
});

import DueDate from "./components/DueDate";

test("check DueDate renders", () => {
    render(<DueDate />);
    const component = screen.getByTitle("dueDate");
    expect(component).toBeInTheDocument();
});

import Button from "react-bootstrap/Button";

test("check if NewTaskDetails renders itself and children", () => {
    // how to get child component from the parent using query?
    render(
	<NewTaskDetails testId="parent">
          <Button data-testid="child" variant="primary">Primary</Button>
	</NewTaskDetails>
    );
    const parentComponent = screen.getByText("Details…");
    const childComponent = screen.getByText("Primary");
    expect(parentComponent).toBeInTheDocument();
    expect(childComponent).toBeInTheDocument();
});


import TaskDetails from "./components/TaskDetails.js";

test("check if TaskDetails renders", () => {
    const taskDetails = {
        due_date: "2022-11-19",
        id: 1,
        title: "test-title",
        active: true
    };
    render(
        <AlertProvider>
          <TaskDetails taskDetails={taskDetails}/>
        </AlertProvider>
    );
    const stopSchedulingTaskBt = screen.getByText("Stop scheduling");
    const resetTaskBt = screen.getByText("Reset");
    expect(stopSchedulingTaskBt).toBeInTheDocument();
    expect(resetTaskBt).toBeInTheDocument();
});

import DueTask from "./components/DueTask.js";
import Table from "react-bootstrap/Table";

test("check if TasksList with a DueTask child renders", () => {
    const taskDetails = {
        due_date: "2022-11-19",
        id: 1,
        title: "test-title"
    };
    // App produces Context so has to be rendered before DueTask
    // How to make it less interwined?
    render( <Table>
               <tbody>
                 <tr>
                   <AlertProvider>
                     <DueTask taskDetails={taskDetails} />
                   </AlertProvider>
                 </tr>
               </tbody>
            </Table>
          );
    expect(screen.getByText("Details…")).toBeInTheDocument();
});
import TasksGroupSwitcher from "./components/TasksGroupSwitcher.js";

test("check if TasksGroupSwitcher renders", () => {
    render(<TasksGroupSwitcher/>);
    expect(screen.getByText("Inactive reviews")).toBeInTheDocument();
});

