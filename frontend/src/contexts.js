import { createContext, useContext } from "react";
import { useAlert } from "./components/Alert";

const AlertContext = createContext();

export function AlertProvider({ children }) {
    return (
        <AlertContext.Provider value={useAlert()}>
          { children }
        </AlertContext.Provider>
    );
}

export function useAlerts() {
    const context = useContext(AlertContext);
    if(context === undefined) {
        throw Error("useAlerts must be used within a AlertProvider");
    }
    return context;
}
