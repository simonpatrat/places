import React from "react";
import Link from "next/link";

export default function PostImageContainer({
  postImageLoaded,
  featuredImage,
  title,
  postImageRef,
  handleImageLoad,
  children,
}) {
  return (
    <div className="post__img-container">
      {!postImageLoaded && (
        <div
          className="loading"
          style={{
            color: "var(--navmenu-text-color)",
          }}
        >
          Loading image...
        </div>
      )}
      <Link href="/">
        <a className="button-close-image" title="Return to home page">
          <span className="las la-times icon"></span>
        </a>
      </Link>
      <div className="container">
        <div className="row">
          <img
            key={featuredImage}
            // TODO: change netlify CMS config to send only image name
            // FIXME: construct images urls dynamically depending on context
            // And remove the replace regexs
            src={featuredImage.replace(/w_1920/gi, "w_1920,fl_keep_iptc,")}
            alt={title}
            style={{
              opacity: postImageLoaded ? 1 : 0,
            }}
            ref={postImageRef}
            onLoad={handleImageLoad}
            crossOrigin="Anonymous"
          />
        </div>
      </div>
      {children}
    </div>
  );
}
