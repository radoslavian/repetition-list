import { render, screen, fireEvent } from "@testing-library/react";
import AddNewTask from "./components/AddNewTask.js";
import { today } from "./utils.js";

test("test  adding task into database (using the UI)", async () => {
    render(<AddNewTask apiEndpoint="/add-task" />);
    const titleInput = screen.getByPlaceholderText("Task title");
    const detailedDescription = screen.getByPlaceholderText(
        /Detailed description/);
    const multiplierInput = screen.getByTitle("multiplier-input");
    const dueDateInput = screen.getByTitle("dueDate");
    const addBt = screen.getByText("+");

    fireEvent.change(titleInput,
                     {target: {value: "Test Task"}});
    fireEvent.change(detailedDescription,
                     {target: {value: "example description"}});
    fireEvent.change(multiplierInput,
                     {target: {value: "1.7"}});
    fireEvent.change(dueDateInput,
                     {target: {value: today(10)}});
    fireEvent.click(addBt);

    // check if modal with error message was displayed (or not)
});
