import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "./index.css";

import { MantineProvider } from "@mantine/core";
import { theme } from "./theme/index.ts";
import { Notifications } from "@mantine/notifications";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications
        position="top-right"
        zIndex={1000}
        styles={{
          root: {
            isolation: "isolate",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)",
          },
        }}
      />
      <App />
    </MantineProvider>
  </StrictMode>,
);
