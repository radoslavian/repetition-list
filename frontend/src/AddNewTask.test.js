import fetchMock from "fetch-mock-jest";
import { render,
         screen,
         fireEvent,
         waitFor,
       } from "@testing-library/react";
import { AlertProvider, ApiProvider } from "./contexts";
import { today, delay } from "./utils";
import App from "./App";
// has .isEqual - deep comparison objects for equality
import { _ } from "lodash";
import { act } from "react-dom/test-utils";

class Task {
    constructor() {
        this.dueDate = today(2);
        this.titleInput = screen.getByPlaceholderText("New task title");
        fireEvent.change(this.titleInput,
                         {target: {value: "Test Task"}});

        // get description button:
        this.descriptionDetailsBt = screen.getByText("Description...");

        // click description button:
        fireEvent.click(this.descriptionDetailsBt);
        this.detailedDescription = screen.getByPlaceholderText(
            /Detailed description/);
        fireEvent.change(this.detailedDescription,
                         {target: {value: "example description"}});

        // selecting a date from a date-picker
        this.dueDateInput = screen.getByTitle("dueDate");
        this.expectedResponse = '{"title":"Test Task",'
            +'"description":"example description"'
            +`,"multiplier":1.2,"due_date":"${this.dueDate}"}`;

        this.addBt = screen.getByText("+");
    }
}

describe("adding tasks to the database", () => {
    beforeAll(() => {
	const okResponse = new Response({taskId: 1, status: 200});
	fetchMock
            .postOnce(
		/http:\/\/.*\/v1\/add\-task/, okResponse)
            .get(/http:\/\/.*\/v1\/tasks/, JSON.stringify([{
                "active": true, 
                "description": "Task Description",
                "due_date": today(2), 
                "id": 12, 
                "intro_date": today(),
                "multiplier": 1.2, 
                "title": "Test Task"
            }]));
    });

    afterAll(() => {
	fetchMock.restore();
	fetchMock.reset();
    });

    beforeEach(async () => {
        await act(() => render(
            <AlertProvider>
              <ApiProvider>
                <App/>
              </ApiProvider>
            </AlertProvider>
        ));
    });

    test("normal adding task into database (using the UI)", async () => {
        const task = new Task();
        // later add multiplier slider testing
        fireEvent.change(task.dueDateInput,
                         {target: {value: task.dueDate}});
        await act(async () => fireEvent.click(task.addBt));

        expect(await screen.findByText("Test Task"))
            .toBeInTheDocument();
        expect(fetchMock.called("http://localhost:3000/v1/add-task"))
            .toBeTruthy();

        const receivedResponse = fetchMock.lastCall(
            "http://localhost:3000/v1/add-task")[1].body;
        expect(_.isEqual(JSON.parse(receivedResponse),
                         JSON.parse(task.expectedResponse))).toBeTruthy();
    });

    test("attempt to add empty title to a new task", () => {
        const titleInput = screen.getByPlaceholderText("New task title");
        fireEvent.change(titleInput,
                         {target: {value: ""}});
        const addBt = screen.getByText("+");
        fireEvent.click(addBt);
        expect(screen.getByText("Error: Empty title"))
            .toBeInTheDocument();
    });

    test("selecting due date earlier than the date of task adding",
         async () => {
             const dueDateInput = screen.getByTitle("dueDate");
             let dueDateInRequest;
             fireEvent.change(screen.getByPlaceholderText("New task title"),
                              {target: {value: "Test Task"}});
             fireEvent.change(dueDateInput,
                              {target: {value: today(-10)}});
             fireEvent.click(screen.getByText("+"));

             expect(screen.getByText(
                 "Error: Task can't have assigned due "
                     + "date that is earlier than the current date."))
                 .toBeInTheDocument();
         });

    test("failure to add new task", async () => {
        // has to come after all others, since
        // changes default fetchMock get route

        fetchMock.post(/http:\/\/.*\/v1\/add\-task/,
                      // returns mocked server error
                       { throws: Error("server error") },
                      { overwriteRoutes: true });
        const task = new Task();
        fireEvent.change(task.dueDateInput,
                         {target: {value: task.dueDate}});
        await act(async () => fireEvent.click(task.addBt));
        expect(screen.getByText("The server is unresponsive"))
            .toBeInTheDocument();
    });
});

/*
// Currently changing multiplier into invalid value (i.e. text, v < 1)
// is hindered by putting a slider as an input for modyfing value.
// This test will be written some time later.

test("attempt to put not-a-number in the multiplier field", () => {
    const multiplier = screen.getByLabelText("multiplier");
    fireEvent.change(multiplier,
                     {target: {value: "test"}});
    fireEvent.click(screen.getByText("+"));
});
*/
