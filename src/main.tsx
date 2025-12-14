import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

const rootElement = document.getElementById("root");

if (!rootElement) {
    console.error("Failed to find the root element. Make sure there is a <div id='root'></div> in your HTML.");
    throw new Error("Root element not found");
}

createRoot(rootElement).render(<App />);
