import { default as BSAlert } from "react-bootstrap/Alert";
import { useState } from "react";

const fallbackRemove = () => console.warn(
    "No alert 'remove' function specified in Alert.js");

export function Alert({ message, remove = fallbackRemove, variant }) {
    const [show, setShow] = useState(true);
    const handleClose = () => {
        setShow(false);
        // rather dirty solution:
        // without timeout, alert vanishes instantly
        // - with no fade-out effect
        // with timeout set too high, will render again alert that
        // was removed shortly before
        setTimeout(() => remove(), 100);
    };

    return (
        <BSAlert
          show={show}
          variant={variant}
          onClose={handleClose}
          dismissible
        >
          {message}
        </BSAlert>
    );
}

export function useAlert() {
    // what would happen if I had used here useRef instead of useState?
    const [alerts, setAlerts] = useState([]);
    const remove = index => setAlerts(
        alerts.filter((v, i) => i !== index));
    const alert = (msg, variant) => setAlerts(
        [...alerts, {message: msg, variant: variant}]);

    // convenience functions
    const error = msg => alert(msg, "danger");
    const warn = msg => alert(msg, "warning");
    const info = msg => alert(msg, "info");

    const renderAlerts = () => alerts.map(
        (alert, i) => (
            <Alert
              key={`Error-${Math.random()*100}`}
              message={alert.message}
              variant={alert.variant}
              // array index to be removed from alerts
              remove={() => remove(i)}
            />));

    return {error, warn, info, renderAlerts};
}
