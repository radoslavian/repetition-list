import { render,
         screen,
         fireEvent,
         waitFor,
         waitForElementToBeRemoved } from "@testing-library/react";
import { within } from "@testing-library/dom";
import { today, delay } from "./utils.js";
import PreviousReviews from "./components/PreviousReviews";
import ApiClient from "./ApiClient";
import { AlertProvider } from "./contexts";
import App from "./App";

// versions higher than @2 have an error that results in import failure
// had to install this specific version with `npm install node-fetch@2`
// cannot run 'expect' asynchronously - they will always end successfully

import fetchMock from "fetch-mock-jest";

function setupServer() {
    const data = [
        {
            active: true,
            due_date: today(-2),
            id:1,
            intro_date: today(-4),
            multiplier:1.8,
            title:"test title",
            "description": "usual task description"
        }
    ];
    fetchMock.get("http://localhost:3000/v1/tasks",
                  JSON.stringify(data));
}

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
    fetchMock.get("http://localhost:3000/v1/task/1/reviews",
                  JSON.stringify(rows));
    render(<PreviousReviews
             taskId="1" apiEndpoint="/v1/task/" expanded={true} />);
    const component = screen.getByTestId("PreviousReviews");

    expect(component).toBeInTheDocument();

    // since PreviousReviews uses useEffect to asynchronously fetch content
    // from the server, flow of execution has to be suspended
    // otherwise component will have only header after first render
    // but otherwise will be valid (this is why waitFor doesn't work
    // in this case)
    
    await delay(200);
    const rowsNumber = component.getElementsByTagName("tr").length;
    expect(rowsNumber).toBe(rows.length + 1);  // one for header

    // check if component has all the due-dates text from the rows
    rows.map(row => expect(component)
             .toHaveTextContent(new Date(row.prev_due_date)
                                .toISOString().split("T")[0]));
});

describe("tests that require custom setup", () => {
    beforeAll(() => {
        setupServer();
        const okResponse = new Response({taskId: 1, status: 200}, 200);
    });

    beforeEach(() => {
        // since App downloads data from the API, it  has to be rendered after
        // setting up a fake API endpoint
        render(
            <AlertProvider>
              <App/>
            </AlertProvider>
        );
    });

    afterAll(() => {
        fetchMock.restore();
        fetchMock.reset();
    });

    test("displaying task on the tasks list", async () => {
        const taskTitle = await screen.findByText("test title");
        expect(taskTitle).toBeInTheDocument();
    });

    test("ticking-off a task", async () => {
        let tickedOff = false;
        fetchMock.put("http://localhost:3000/v1/task/1/tick-off",
                      (url, request) => tickedOff = true);
        const tickOffBt = await screen.findByLabelText("tick off");

        expect(tickOffBt).toBeInTheDocument();
        fireEvent.click(tickOffBt);
        expect(tickedOff).toBeTruthy();
    });

    test("deleting item from a (due) list", async () => {
        let deleted = false;
        fetchMock.delete("http://localhost:3000/v1/task/1",
                         () => {
                             deleted = true;
                             return okResponse;
                         });
        const deleteButton = await screen.findByLabelText("delete");
        expect(deleteButton).toBeInTheDocument();
        deleteButton.click();
        const confirmDeleteBt = await screen.findByText("Delete");
        expect(confirmDeleteBt).toBeInTheDocument();
        const confirmDeletionDialog = screen.getByText(
            "Confirm deletion of the task:");
        expect(confirmDeletionDialog).toBeInTheDocument();
        confirmDeleteBt.click();
        expect(deleted).toBeTruthy();
    });

    test("reseting a task", async () => {
        let resetDone = false;
        fetchMock.patch("http://localhost:3000/v1/task/1/reset",
                        () => {
                            resetDone = true;
                            return okResponse;
                        });
        let resetMenuItem;
        await waitFor(() => screen.getByText("Reset"))
            .then(reset => resetMenuItem = reset);
        expect(resetMenuItem).toBeInTheDocument();
        fireEvent.click(resetMenuItem);

        // checks only if app sent request to the server,
        // in an honest testing scenario, should rather check
        // if the response to the request sent to the server
        // is reflected in the UI - in this case -
        // whether item has actually been reset
        // (previous reviews removed and dates changed)
        expect(resetDone).toBeTruthy();
    });
});

describe("task updates", () => {
    beforeAll(() => {
        setupServer();
        function serverResponse(url, request) {
            const title = JSON.parse(request.body).title;
            if (title === "") {
                console.log("empty title");
                return {
                    status: 400,
                    body: { status: "Can not set title to an empty string." }
                };
            }
            return JSON.stringify({
                status: 200,
                body: { status: "updated" }
            });
        }

        fetchMock.patch("http://localhost:3000/v1/task/1/update",
                        serverResponse);
    });

    beforeEach(() => {
        // since App downloads data from the API, it  has to be rendered after
        // setting up a fake API endpoint
        render(
            <AlertProvider>
              <App/>
            </AlertProvider>
        );
    });

    afterAll(() => {
        fetchMock.restore();
        fetchMock.reset();
    });

    test("modifying task description", async () => {
        const editButton = await screen.findByText("Edit");
        expect(editButton).toBeInTheDocument();
        fireEvent.click(editButton);
        const descriptbionEdit = await screen.findByText(
            "usual task description");
        expect(descriptbionEdit).toBeInTheDocument();
        fireEvent.change(descriptbionEdit,
                         {target: {value: "New, updated description"}});
        fireEvent.blur(descriptbionEdit);
        expect(screen.getByText("New, updated description"))
            .toBeInTheDocument();

        // update delay
        await delay(1000);
        // expect last server response to a patch request
        const lastOptions = fetchMock.lastOptions(
            'http://localhost:3000/v1/task/1/update');
        console.log(lastOptions);
        const expectedBody = '{"description":"New, updated description"}';
        expect(lastOptions.body === expectedBody).toBeTruthy();
    });

    test("updating task title", async () => {
        // click on title displayed on a task-list
        fireEvent.click(await screen.findByText("test title"));
        fireEvent.change(screen.getByTestId("title-input"),
                         {target: {value: "Updated title"}});
        fireEvent.click(screen.getByTitle("save title"));  // save button

        const updatedTitle = await screen.findByText("Updated title");
        expect(fetchMock.done()).toBeTruthy();
        expect(updatedTitle).toBeInTheDocument();
    });

    test("attempt to clear the task title", async () => {
        fireEvent.click(await screen.findByText("test title"));
        fireEvent.change(screen.getByTestId("title-input"),
                         {target: {value: ""}});
        fireEvent.click(screen.getByTitle("save title"));

        const message = await screen
              .findByText("Can not set title to an empty string.");
         expect(message).toBeInTheDocument();
    });

    test("cancelling attempt to change task title", async () => {
        fireEvent.click(await screen.findByText("test title"));
        fireEvent.change(screen.getByTestId("title-input"),
                         {target: {value: ""}});
        fireEvent.click(screen.getByTitle("cancel modifications"));
        expect(screen.getByText("test title")).toBeInTheDocument();
    });
});
