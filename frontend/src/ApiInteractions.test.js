import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddNewTask from "./components/AddNewTask.js";
import { today } from "./utils.js";
import PreviousReviews from "./components/PreviousReviews";
import ApiClient from "./ApiClient";
import { AlertProvider } from "./contexts";

test("if PreviousReviews renders review history list", async () => {
    const rows = [
        {
            "multiplier": 1.0, 
            "prev_due_date": "Wed, 15 Aug 2022 00:00:00 GMT", 
            "reviewed_on": "Wed, 16 Aug 2022 00:00:00 GMT"},
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
    fetch.mockResponse(JSON.stringify(rows));

    render(<PreviousReviews
             taskId="1" apiEndpoint="/v1/task/" expanded={true} />);
    const component = screen.getByTestId("PreviousReviews");

    expect(component).toBeInTheDocument();

    // since PreviousReviews uses useEffect to asynchronously fetch content
    // from the server, waitFor() has to be used - otherwise component
    // will be empty after the first render
    await waitFor(() => {
        expect(component.getElementsByTagName("tr").length)
            .toBe(rows.length + 1);
        // check if component has all the due-dates text from the rows
        rows.map(row => expect(component)
                 .toHaveTextContent(new Date(row.prev_due_date)
                                    .toISOString().split("T")[0]));
    });
});

test("normal adding task into database (using the UI)", async () => {
    render(
        <AlertProvider>
          <AddNewTask apiEndpoint="/add-task" />
        </AlertProvider>
    );
    const titleInput = screen.getByPlaceholderText("New task title");
    // get description button:
    const descriptionDetailsBt = screen.getByText("Description...");
    // click description button:
    fireEvent.click(descriptionDetailsBt);
    const detailedDescription = screen.getByPlaceholderText(
        /Detailed description/);

    // add slider testing

    const dueDateInput = screen.getByTitle("dueDate");
    const addBt = screen.getByText("+");
    throw Error("This is where I left last time.");
    fireEvent.change(titleInput,
                     {target: {value: "Test Task"}});
    fireEvent.change(detailedDescription,
                     {target: {value: "example description"}});
    fireEvent.change(dueDateInput,
                     {target: {value: today(10)}});
    fireEvent.click(addBt);
});
