import { extendTheme, ColorMode, StyleFunctionProps } from "@chakra-ui/react";

const graphPaperCssVars = (colorMode: ColorMode) => ({
  "--graph-paper-grid-major-color": colorMode === "light" ? "#eafcfc" : "#02242b",
  "--graph-paper-grid-minor-color":
    colorMode === "light"
      ? "var(--chakra-colors-blackAlpha-50)"
      : "var(--chakra-colors-whiteAlpha-50)",
});

export const theme = extendTheme({
  styles: {
    global: ({ colorMode }: StyleFunctionProps) => ({
      body: {
        ...graphPaperCssVars(colorMode),
        minHeight: "100vh",
        backgroundColor: colorMode === "light" ? "white" : "gray.900",
        backgroundImage:
          "linear-gradient(var(--graph-paper-grid-major-color) 2px, transparent 2px), linear-gradient(90deg, var(--graph-paper-grid-major-color) 2px, transparent 2px), linear-gradient(var(--graph-paper-grid-minor-color) 1px, transparent 1px), linear-gradient(90deg, var(--graph-paper-grid-minor-color) 1px, transparent 1px)",
        backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px",
        backgroundPosition: "-2px -2px, -2px -2px, -1px -1px, -1px -1px",
      },
    }),
  },
});
