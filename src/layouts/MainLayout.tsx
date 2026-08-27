import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import DesktopHeader from "../components/layout/DesktopHeader";
import MobileBottomNav from "../components/layout/MobileBottomNav";

const MainLayout = () => {
  return (
    <AppShell
      header={{ height: { base: 0, sm: 75 } }}
      footer={{ height: { base: 70, sm: 0 } }}
      padding="md"
    >
      <AppShell.Header visibleFrom="sm">
        <DesktopHeader />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>

      <AppShell.Footer hiddenFrom="sm" withBorder={false} bg="transparent">
        <MobileBottomNav />
      </AppShell.Footer>
    </AppShell>
  );
};

export default MainLayout;
