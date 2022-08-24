import { render, screen } from "@testing-library/react";
import { AlertProvider } from "./contexts";
import App from "./App";

test("check if App rendering doesn't run into exceptions", () =>{
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

test("check if NewTaskDetails renders", () => {
    render(<NewTaskDetails testId="NewTaskDetails" />);
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

