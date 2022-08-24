import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { today } from "./utils.js";
import PreviousReviews from "./components/PreviousReviews";
import ApiClient from "./ApiClient";
import { AlertProvider } from "./contexts";
import App from "./App";

// versions higher than @2 have error that results in import failure
// had to install this specific version with `npm install node-fetch@2`
import fetchMock from "fetch-mock-jest";

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
    fetchMock.getOnce("http://localhost:3000/v1/task/1/reviews",
                  JSON.stringify(rows));
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

test("displaying task on the tasks list", async () => {
    const data = [{active: true,
                   description: "test description",
                   due_date: today(-2),
                   id:1,
                   intro_date: today(-4),
                   multiplier:1.8,
                   title:"test title"}];
    fetchMock.getOnce("http://localhost:3000/v1/tasks",
                      JSON.stringify(data));

    // since App downloads data from the API, it  has to be rendered after
    // setting up a fake API endpoint
    render(
        <AlertProvider>
          <App/>
        </AlertProvider>
    );

    const taskTitle = await screen.findByText("test title");
    expect(taskTitle).toBeInTheDocument();
});
