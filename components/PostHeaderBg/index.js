import React from "react";

export default function PostHeaderBg({ postImageColor }) {
  return (
    <div
      className="post__header-bg"
      style={{
        backgroundRepeat: "no-repeat",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 0,
        backgroundColor: postImageColor,
      }}
    ></div>
  );
}
