import React from "react";
import Link from "next/link";
import classnames from "classnames";

export default function PostNavigation({
  previousPost,
  nextPost,
  isOverImage,
  displayTitles,
}) {
  const postNavigationClassNames = classnames("post-navigation", {
    "post-navigation--over-image": isOverImage,
  });
  return (
    <div className={postNavigationClassNames}>
      {nextPost && (
        <Link href="/posts/[slug]" as={`/posts/${nextPost.attributes.slug}`}>
          <a
            className="post-navigation__link post-navigation__link--next"
            title={nextPost.attributes.title}
          >
            <span className="icon las la-arrow-left"></span>
            {displayTitles && nextPost.attributes.title}
          </a>
        </Link>
      )}
      {!nextPost && <div></div>}
      {previousPost && (
        <Link
          href="/posts/[slug]"
          as={`/posts/${previousPost.attributes.slug}`}
        >
          <a
            className="post-navigation__link post-navigation__link--previous"
            title={previousPost.attributes.title}
          >
            {displayTitles && previousPost.attributes.title}
            <span className="icon las la-arrow-right"></span>
          </a>
        </Link>
      )}
      {!previousPost && <div></div>}
    </div>
  );
}
