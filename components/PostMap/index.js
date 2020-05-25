import React from "react";

export default function PostMap({ postImageColor, mapRef }) {
  return (
    <section
      className="post-map"
      style={{
        background: !!postImageColor ? postImageColor : "transparent",
      }}
    >
      <div className="post-map__inner" ref={mapRef}></div>
    </section>
  );
}
