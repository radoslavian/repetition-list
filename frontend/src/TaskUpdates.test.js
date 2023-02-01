import { render,
         screen,
         fireEvent } from "@testing-library/react";
import { today } from "./utils.js";
import PreviousReviews from "./components/PreviousReviews";
import { ApiProvider, AlertProvider, TasksManager } from "./contexts";
import App from "./App";
import { act } from "react-dom/test-utils";
import fetchMock from "fetch-mock-jest";

beforeAll(() => {
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

    function serverResponse(url, request) {
        const title = JSON.parse(request.body).title;
        if (title === "") {
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

beforeEach(async () => {
    // since App downloads data from the API, it  has to be rendered after
    // setting up a fake API endpoint
    await act(() => render(
        <AlertProvider>
          <ApiProvider>
            <TasksManager>
              <App/>
            </TasksManager>
          </ApiProvider>
        </AlertProvider>
    ));
});

afterAll(() => {
    fetchMock.restore();
    fetchMock.reset();
});

test("modifying task description", async () => {
    // replaces original implementation of setTimeout()
    jest.useFakeTimers();
    screen.findByText("Details…")
        .then(element => fireEvent.click(element));
    const editButton = await screen.findByText("Edit");
    fireEvent.click(editButton);
    const descriptbionEdit = await screen.findByText(
        "usual task description");

    expect(descriptbionEdit).toBeInTheDocument();
    fireEvent.change(
        descriptbionEdit,
        {target: {value: "New, updated description"}});
    fireEvent.blur(descriptbionEdit);

    // server request function used by TaskDetails is debounced
    // with setTimeout so I need to fast-forward all timers
    jest.runAllTimers();
    expect(screen.getByText("New, updated description"))
        .toBeInTheDocument();

    // expect last server response to a patch request
    const lastOptions = fetchMock.lastOptions(
        'http://localhost:3000/v1/task/1/update');
    const expectedBody = '{"description":"New, updated description"}';
    expect(lastOptions.body === expectedBody).toBeTruthy();

    // restores original timers
    jest.useRealTimers();
});

async function updatingTaskTitle() {
    // click on title displayed on a task-list
    fireEvent.click(await screen.findByText("test title"));
    fireEvent.change(screen.getByTestId("title-input"),
                     {target: {value: "Updated title"}});
    fireEvent.click(screen.getByTitle("save title"));  // save button
}

test("updating task title", async () => {
    await updatingTaskTitle();
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

test("changing title, submitting and again cancelling", async () => {
    /* Test for application logic bug:
     * Recently, when I modified the title, saved it, clicked it 
     * again in order to make another modification and then
     * cancelled, the title got back to the version before the
     * second modification.
     */
    await updatingTaskTitle();
    const updatedTitle = await screen.findByText("Updated title");
    fireEvent.click(updatedTitle);
    fireEvent.click(screen.getByTitle("cancel modifications"));
    expect(await screen.findByText("Updated title")).toBeInTheDocument();
});
