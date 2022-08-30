import fetchMock from "fetch-mock-jest";
import { render,
         screen,
         fireEvent,
         waitFor,
       } from "@testing-library/react";
import AddNewTask from "./components/AddNewTask.js";
import { AlertProvider } from "./contexts";
import { today, delay } from "./utils";
import App from "./App";
// has .isEqual - deep comparison objects for equality
import { _ } from "lodash";
import { act } from "react-dom/test-utils";

beforeAll(() => {
    const okResponse = new Response({taskId: 1, status: 200});
    fetchMock
        .postOnce(
            "http://localhost:3000/v1/add-task",
            okResponse)
        .get("*", []);
});

afterAll(() => {
    fetchMock.restore();
    fetchMock.reset();
});

describe("adding tasks to the database", () => {
    beforeEach(async () => {
        await act(() => render(
            <AlertProvider>
              <App/>
            </AlertProvider>
        ));
    });

    test("normal adding task into database (using the UI)", async () => {
        const dueDate = today(2);
        // later add multiplier slider testing
        const expectedResponse = '{"title":"Test Task",'
            +'"description":"example description"'
            +`,"multiplier":1.2,"due_date":"${dueDate}"}`;

        const titleInput = screen.getByPlaceholderText("New task title");
        fireEvent.change(titleInput,
                         {target: {value: "Test Task"}});
        // get description button:
        const descriptionDetailsBt = screen.getByText("Description...");
        // click description button:
        fireEvent.click(descriptionDetailsBt);
        const detailedDescription = screen.getByPlaceholderText(
            /Detailed description/);
        fireEvent.change(detailedDescription,
                         {target: {value: "example description"}});
        // selecting a date from a date-picker
        const dueDateInput = screen.getByTitle("dueDate");
        fireEvent.change(dueDateInput,
                         {target: {value: dueDate}});

        const addBt = screen.getByText("+");
        await act(async () => fireEvent.click(addBt));

        // following used to be within function passed
        // to the fetchMock.postOnce
        expect(fetchMock.called("http://localhost:3000/v1/add-task"))
            .toBeTruthy();
        const receivedResponse = fetchMock.lastCall(
            "http://localhost:3000/v1/add-task")[1].body;
        expect(_.isEqual(JSON.parse(receivedResponse),
                         JSON.parse(expectedResponse))).toBeTruthy();
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
