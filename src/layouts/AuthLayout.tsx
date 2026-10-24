import { AppShell } from "@mantine/core";
import { Outlet, ScrollRestoration } from "react-router-dom";
import MinimalHeader from "../components/layout/MinimalHeader";

const AuthLayout = () => (
  <AppShell header={{ height: 75 }} padding="lg">
    <AppShell.Header>
      <MinimalHeader />
    </AppShell.Header>
    <AppShell.Main>
      <Outlet />
    </AppShell.Main>

    <ScrollRestoration />
  </AppShell>
);

export default AuthLayout;
