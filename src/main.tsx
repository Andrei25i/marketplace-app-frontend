import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "./index.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme/index.ts";
import App from "./App.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./api/queryClient";
import { MotionConfig } from "motion/react";
import AppNotifications from "./components/layout/AppNotifications.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <AppNotifications />
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
);
