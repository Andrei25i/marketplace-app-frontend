import { useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { Notifications } from "@mantine/notifications";

const AppNotifications = () => {
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm})`,
    true,
    { getInitialValueInEffect: false },
  );

  return (
    <Notifications
      position={isDesktop ? "bottom-right" : "top-center"}
      zIndex={1000}
      styles={{
        root: {
          isolation: "isolate",
          transform: isDesktop
            ? "translateZ(0)"
            : "translateX(-50%) translateZ(0)",
          WebkitTransform: isDesktop
            ? "translateZ(0)"
            : "translateX(-50%) translateZ(0)",
        },
      }}
    />
  );
};

export default AppNotifications;
