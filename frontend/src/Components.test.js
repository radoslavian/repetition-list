import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { ApiProvider, AlertProvider } from "./contexts";
import App from "./App";
import PreviousReviews from "./components/PreviousReviews";
import fetchMock from "fetch-mock-jest";
import { useApi, TasksManager } from "./contexts";

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
    fetchMock.get("http://localhost:3000/v1/task/1/reviews",
                  JSON.stringify(rows));

    // this way the "test was not wrapped in act(...)" message
    // no longer appears
    waitFor(() => render(
        <ApiProvider>
          <PreviousReviews
            taskId="1" apiEndpoint="/v1/task/"
            expanded={true} />
        </ApiProvider>
    ));
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
    fetchMock.restore();
    fetchMock.reset();
});

test("check if App rendering doesn't run into exceptions", () => {
    // this should be expanded
    render(
        <AlertProvider>
          <ApiProvider>
            <TasksManager>
              <App/>
            </TasksManager>
          </ApiProvider>
        </AlertProvider>
    );
});

import TaskTitle from "./components/TaskTitle";

describe("test TaskTitle component", () => {
    beforeEach(() => {
        const taskDetails = {
            due_date: "2022-11-19",
            id: 1,
            title: "test title",
            active: true
        };

        render(
            <AlertProvider>
              <ApiProvider>
                <TasksManager>
                  <TaskTitle taskDetails={taskDetails}/>
                </TasksManager>
              </ApiProvider>
            </AlertProvider>
        );
    });

    test("if TaskTitle component renders", () => {
        const component = screen.getByText("test title");
        expect(component).toBeInTheDocument();
    });

    test("if tooltips over titles appear when hovered", async () => {
        const tooltipText = '"test title", click to edit';
        const component = screen.getByText("test title");

        fireEvent.mouseOver(component);
        await waitFor(() => expect(screen.getByText(
            tooltipText)).toBeInTheDocument(),
                      {timeout: 2000, interval: 100});
    });
});

import NewTaskDetails from "./components/NewTaskDetails";

test("check if NewTaskDetails renders", () => {
    render(
        <ApiProvider>
          <TasksManager>
            <NewTaskDetails />
          </TasksManager>
        </ApiProvider>
    );
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
             <ApiProvider>
               <TasksManager>
                 <AddNewTask />
               </TasksManager>
             </ApiProvider>
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
          <ApiProvider>
            <TasksManager>
              <TaskDetails taskDetails={taskDetails}/>
            </TasksManager>
          </ApiProvider>
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
                     <ApiProvider>
                       <TasksManager>
                         <DueTask taskDetails={taskDetails} />
                       </TasksManager>
                     </ApiProvider>
                   </AlertProvider>
                 </tr>
               </tbody>
            </Table>
          );
    expect(screen.getByText("Details…")).toBeInTheDocument();
});
import TasksGroupSwitcher from "./components/TasksGroupSwitcher.js";

test("if TasksGroupSwitcher renders", () => {
    render(<TasksGroupSwitcher/>);
    expect(screen.getByText("Inactive reviews")).toBeInTheDocument();
});
