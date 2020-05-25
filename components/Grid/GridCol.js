import React from "react";

export default function GridCol({ children, cols }) {
  return (
    <div
      className="grid__col"
      style={{
        width: `calc(100% / ${cols})`,
        flexBasis: `calc(100% / ${cols})`,
      }}
    >
      {children}
    </div>
  );
}
