import React, { createContext } from "react";

const ColorsContext = createContext({
  colors: {}
});
ColorsContext.displayName = "ColorsContextInformation";

export default ColorsContext;
