import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const globalStyles = {
  ":root": {
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
    lineHeight: 1.5,
    fontWeight: 400,
    colorScheme: "light dark",
    color: "rgba(255, 255, 255, 0.87)",
    fontSynthesis: "none",
    textRendering: "optimizeLegibility",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  },
  a: {
    fontWeight: 500,
    color: "#646cff",
    textDecoration: "inherit",
  },
  "a:hover": {
    color: "#747bff",
  },
  body: {
    margin: 0,
    display: "flex",
    placeItems: "center",
    minWidth: "320px",
    minHeight: "100vh",
  },
  h1: {
    fontSize: "3.2em",
    lineHeight: "1.1",
  },
};
const config: ThemeConfig = {
  initialColorMode: "dark", // 'dark' | 'light'
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  styles: {
    global: {
      ...globalStyles,
    },
  },
});

export default theme;
