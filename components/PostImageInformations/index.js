import React from "react";

export default function PostImageInformation({ postImageColorPalette }) {
  return (
    <div className="post__img-information-container">
      {!!postImageColorPalette && (
        <div
          className="palette"
          style={{
            zIndex: 1,
          }}
        >
          {postImageColorPalette.map((color, index) => {
            return (
              <div
                key={index}
                className="color-palette__item"
                style={{
                  background: color,
                }}
              ></div>
            );
          })}
        </div>
      )}
    </div>
  );
}
