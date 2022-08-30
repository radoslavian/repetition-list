import { createContext, useContext } from "react";
import { useAlert } from "./components/Alert";
import ApiClient from "./ApiClient";

const AlertContext = createContext();
const ApiContext = createContext();

export function AlertProvider({ children }) {
    return (
        <AlertContext.Provider value={useAlert()}>
          { children }
        </AlertContext.Provider>
    );
}

export function ApiProvider({ children }) {
    const api = new ApiClient("/v1");

    return (
        <ApiContext.Provider value={api}>
          { children }
        </ApiContext.Provider>
    );
}

export function useApi() {
    const apiContext = useContext(ApiContext);
    if(apiContext === undefined) {
        throw Error("useApi must be used within ApiProvider");
    }
    return apiContext;
    
}

export function useAlerts() {
    const context = useContext(AlertContext);
    if(context === undefined) {
        throw Error("useAlerts must be used within an AlertProvider");
    }
    return context;
}
