import React, { createContext } from "react";

const ThemeContext = createContext({
  theme: "light",
});
ThemeContext.displayName = "ThemeContextInformation";

export default ThemeContext;
