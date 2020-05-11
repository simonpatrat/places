import React, { createContext } from "react";

const ThemeContext = createContext({
  theme: "light",
});
ThemeContext.displayName = "ThemeContextInformation";

const { Provider, Consumer } = ThemeContext;
export { Provider, Consumer };
export default ThemeContext;
