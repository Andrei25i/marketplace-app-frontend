import { AppShell } from "@mantine/core";
import { Outlet, ScrollRestoration } from "react-router-dom";
import MinimalHeader from "../components/layout/MinimalHeader";
import PageTransition from "@/components/layout/PageTransition";

const AuthLayout = () => (
  <AppShell header={{ height: 75 }} padding="lg">
    <AppShell.Header>
      <MinimalHeader />
    </AppShell.Header>

    <AppShell.Main>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </AppShell.Main>

    <ScrollRestoration />
  </AppShell>
);

export default AuthLayout;
