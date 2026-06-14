import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@workspace/api-client-react";
setBaseUrl("http://10.49.85.88:3000");
createRoot(document.getElementById("root")!).render(<App />);
