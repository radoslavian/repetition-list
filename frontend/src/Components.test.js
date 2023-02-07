import { render,
         cleanup,
         screen,
         waitFor,
         fireEvent } from "@testing-library/react";
import { ApiProvider, AlertProvider } from "./contexts";
import App from "./App";
import PreviousReviews from "./components/PreviousReviews";
import fetchMock from "fetch-mock-jest";
import { useApi, TasksManager } from "./contexts";
import { act } from "react-dom/test-utils";

// components imports
import NewTaskDetails from "./components/NewTaskDetails";
import TasksGroupSwitcher from "./components/TasksGroupSwitcher.js";

test("check if App rendering doesn't run into exceptions", async () => {
    fetchMock.get("http://localhost:3000/v1/tasks",
                  JSON.stringify([]));
    await act(() => render(
        <AlertProvider>
          <ApiProvider>
            <TasksManager>
              <App/>
            </TasksManager>
          </ApiProvider>
        </AlertProvider>
    ));
    await waitFor(() => expect(
        fetchMock.called("http://localhost:3000/v1/tasks")).toBeTruthy());
    fetchMock.restore();
    fetchMock.reset();
});

test("if PreviousReviews renders review history list", async () => {
    // should be split into tests within a describe block
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
    await waitFor(() => render(
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

test("if NewTaskDetails renders", () => {
    render(
        <ApiProvider>
          <TasksManager>
            <NewTaskDetails />
          </TasksManager>
        </ApiProvider>
    );
    expect(screen.getByText("Add description...")).toBeInTheDocument();
    expect(screen.getByText("Multiplier:")).toBeInTheDocument();
});

import TaskDescription from "./components/TaskDescription";

test("if empty TaskDescription renders", () => {
    render(<TaskDescription />);
    const component = screen.getByText("Add description...");
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

    const addNewTaskBt = screen.getByText("Add new task");
    fireEvent.click(addNewTaskBt);
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

test("if NewTaskDetails renders itself and children", () => {
    // how to get child component from the parent using query?
    render(
	<NewTaskDetails testId="parent">
          <Button data-testid="child" variant="primary">Primary</Button>
	</NewTaskDetails>
    );
    const parentComponent = screen.getByTestId("new-task-details");
    const childComponent = screen.getByText("Primary");
    expect(parentComponent).toBeInTheDocument();
    expect(childComponent).toBeInTheDocument();
});


import TaskDetails from "./components/TaskDetails.js";

test("check if TaskDetails renders", async () => {
    const taskDetails = {
        due_date: "2022-11-19",
        id: 1,
        title: "test-title",
        active: true
    };

    // works somehow with waitFor, doesn't work with act()
    await waitFor(() => render(
        <AlertProvider>
          <ApiProvider>
            <TasksManager>
              <TaskDetails taskDetails={taskDetails}/>
            </TasksManager>
          </ApiProvider>
        </AlertProvider>
    ));
    const stopSchedulingTaskBt = screen.getByText("Stop scheduling");
    const resetTaskBt = screen.getByText("Reset");
    expect(stopSchedulingTaskBt).toBeInTheDocument();
    expect(resetTaskBt).toBeInTheDocument();
});

import DueTask from "./components/DueTask.js";
import Table from "react-bootstrap/Table";

test("check if TasksList with a DueTask child renders", async () => {
    // When performing, produces a following warning:
    // When testing, code that causes React state
    // updates should be wrapped into act(...)

    const taskDetails = {
        due_date: "2022-11-19",
        id: 1,
        title: "test-title"
    };
    // App produces Context so has to be rendered before DueTask
    // How to make it less interwined?
    await waitFor(() =>render(
        <table>
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
        </table>
    ));
    expect(screen.getByText("Details…")).toBeInTheDocument();
});

test("if TasksGroupSwitcher renders", () => {
    render(<TasksGroupSwitcher/>);
    expect(screen.getByText("Inactive reviews")).toBeInTheDocument();
});

test("if TasksGroupSwitcher renders 'No review tasks...'"
     // sprawdzić ten test
     + " header in all tabs.", async () => {
         const NUMBER_OF_TABS = 3;
         render(<TasksGroupSwitcher allTasks={[]}/>);

         await expect(screen.getAllByText("No review tasks on this list.")
                      .length).toBe(NUMBER_OF_TABS);
     });

import TaskDetailsModal from "./components/TaskDetailsModal.js";

test("if TaskDetailsModal shows up when clicked", async () => {
    const taskDetails = {
        due_date: "2022-11-19",
        id: 1,
        title: "test title",
        active: true
    };

    render(
        <AlertProvider>
          <TasksManager>
            <ApiProvider>
              <TaskDetailsModal taskDetails={taskDetails}/>
            </ApiProvider>
          </TasksManager>
        </AlertProvider>
    );

    const detailsButton = await screen.getByText("Details…");
    fireEvent.click(detailsButton);

    const modalTitleText = "Task Details:";
    const modalTitle = screen.getByText(modalTitleText);
    
    waitFor(() => expect(modalTitleText).toBeInTheDocument());
});


test("if TasksGroupSwitcher renders 'No review tasks...' on two of three tabs",
     // Warning: An update to DropdownMenu inside a
     // test was not wrapped in act(...).
     async () => {
         const taskDetails = {
             due_date: "2022-11-19",
             id: 1,
             title: "test title",
             active: true
         };
         await waitFor(() => render(
             <AlertProvider>
               <ApiProvider>
                 <TasksManager>
                   <TasksGroupSwitcher allTasks={[taskDetails]}/>
                 </TasksManager>
               </ApiProvider>
             </AlertProvider>
         ));
         const NUMBER_OF_TABS = 2;
         expect(screen.getAllByText(
             "No review tasks on this list.")
                .length).toBe(NUMBER_OF_TABS);
     });
