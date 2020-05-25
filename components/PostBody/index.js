import React from "react";

export default function PostBody({ title, html, postDate, resume }) {
  return (
    <div className="post__body">
      <h2 className="post__title">{title}</h2>
      <div
        className="post__content-html"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="post__date">{postDate}</div>
      <div className="post__resume">{resume}</div>
      {/*         <div className="post__rating">{rating}</div>
          <div className="post__gps-coordinates">{gpsCoordinates}</div> */}
    </div>
  );
}
