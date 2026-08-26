import { createTheme } from "@mantine/core";
import type { MantineColorsTuple } from "@mantine/core";

const primaryColors: MantineColorsTuple = [
  "#ebf5f4",
  "#D8EAE8",
  "#B2DFDB",
  "#8ac9c3",
  "#63b4ab",
  "#3c9f93",
  "#00897B",
  "#007a6e",
  "#006b61",
  "#005b52",
];

export const theme = createTheme({
  colors: {
    primary: primaryColors,
  },
  primaryColor: "primary",

  fontFamily: "Inter, sans-serif",

  components: {
    Card: {
      defaultProps: {
        bg: "#F1F5F5",
        radius: "md",
        padding: "md",
      },
    },
  },
});
