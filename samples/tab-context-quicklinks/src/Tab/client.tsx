import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initializeIcons } from "@fluentui/react";

import App from "./App";

initializeIcons();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
