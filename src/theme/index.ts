import { createTheme, TextInput, PasswordInput, Select } from "@mantine/core";
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

const inputStyles = {
  label: {
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.031em",
    marginBottom: "6px",
    color: "var(--mantine-color-gray-6)",
  },
  input: {
    borderRadius: "8px",
  },
  section: {
    color: "var(--mantine-color-gray-7)",
  },
};

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
    Paper: {
      defaultProps: {
        bg: "#F1F5F5",
        radius: "md",
      },
    },
    Title: {
      defaultProps: {
        c: "dark.8",
      },
    },

    TextInput: TextInput.extend({
      styles: inputStyles,
    }),

    PasswordInput: PasswordInput.extend({
      styles: inputStyles,
    }),

    Select: Select.extend({
      styles: inputStyles,
    }),

    ThemeIcon: {
      defaultProps: {
        radius: "100%",
        variant: "light",
        color: "primary.1",
        c: "primary",
      },
    },
  },
});
