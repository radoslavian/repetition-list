import { render,
         screen,
         fireEvent } from "@testing-library/react";
import { within } from "@testing-library/dom";
import { today } from "./utils.js";
import { AlertProvider, ApiProvider, TasksManager } from "./contexts";
import App from "./App";
import { act } from "react-dom/test-utils";

// versions higher than @2 have an error that results in import failure
// had to install this specific version with `npm install node-fetch@2`
// cannot run 'expects' asynchronously - they will always end successfully

import fetchMock from "fetch-mock-jest";

function setupMockGet(){
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


beforeAll(() => {
    const okResponse = new Response({taskId: 1, status: 200});
    setupMockGet();
    fetchMock.delete("http://localhost:3000/v1/task/1", okResponse);
    fetchMock.patch("http://localhost:3000/v1/task/1/reset", okResponse);
});

beforeEach(async () => {
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

test("displaying task on the tasks list", async () => {
    const taskTitle = await screen.findByText("test title");
    expect(taskTitle).toBeInTheDocument();
});

test("ticking-off a task", async () => {
    fetchMock.putOnce("http://localhost:3000/v1/task/1/tick-off",
                      JSON.stringify({
                          "status": "updated",
                          "due_date": today(2)}));
    const tickOffBt = await screen.findByLabelText("tick off");
    await act(async () => fireEvent.click(tickOffBt));
    const dueTasks = screen.getByTestId("due-tasks-table");
    const upcoming = screen.getByTestId("upcoming-tasks-list");

    expect(fetchMock.called("http://localhost:3000/v1/task/1/tick-off"))
        .toBeTruthy();
    expect(within(dueTasks).queryByText("test title")).toBeNull();
    expect(await within(upcoming).findByText("test title"))
        .toBeInTheDocument();
    expect(await within(upcoming).findByText(today(2))).toBeInTheDocument();
});

test("deleting item from a due list", async () => {
    const deleteButton = await screen.findByLabelText("delete");
    await act(async () => deleteButton.click());
    const confirmDeleteBt = await screen.findByText("Delete");
    const confirmDeletionDialog = screen.getByText(
        "Confirm deletion of the task:");
    await act(async () => confirmDeleteBt.click());
    expect(fetchMock.calls(
        "http://localhost:3000/v1/task/1")[0][1].method)
        .toEqual("DELETE");
});

test("resetting a task", async () => {
    // kliknięcie na Details...
    screen.findByText("Details…").then(details => fireEvent.click(details));
    const resetMenuItem = await screen.findByText("Reset");
    expect(resetMenuItem).toBeInTheDocument();
    await act(() => fireEvent.click(resetMenuItem));

    // checks only if app sent request to the server,
    // in a more honest testing scenario, should rather check
    // if the response is reflected in the UI - in this case -
    // whether item has actually been reset
    // (previous reviews removed and dates changed)
    expect(fetchMock.called("http://localhost:3000/v1/task/1/reset"))
        .toBeTruthy();
});
