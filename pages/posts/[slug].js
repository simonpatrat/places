import Link from "next/link";
import React, { useState, useEffect } from "react";
import ColorThief from "colorthief";

import { orderPostsByDate } from "../../lib/orderPostsByDate";
import { lightOrDark } from "../../lib/color";

const Post = (props) => {
  const [postImageColorPalette, setPostImageColorPalette] = useState(null);
  const [postImageLoaded, setPostImageLoaded] = useState(false);

  if (!props.post) {
    return <div>Loading...</div>;
  }

  const {
    post: {
      attributes: { title, featuredImage, rating, date, resume },
      html,
    },
    nextPost,
    previousPost,
  } = props;

  useEffect(() => {
    const colorThief = new ColorThief();
    let img = new Image();
    img.crossOrigin = "Anonymous";

    img.addEventListener("load", function () {
      const palette = colorThief.getPalette(img, 5);
      const mainColor = colorThief.getColor(img);
      const cssColor = `rgb(${mainColor.join(",")})`;
      const colorBrightness = lightOrDark(cssColor);

      document.documentElement.style.setProperty(
        "--background-color",
        cssColor
      );
      document.documentElement.style.setProperty(
        "--text-color",
        colorBrightness === "dark" ? "white" : "black"
      );
      setPostImageColorPalette(palette);
      setPostImageLoaded(true);
    });

    img.crossOrigin = "Anonymous";
    img.src = featuredImage;
  }, [featuredImage]);

  return (
    <>
      <article className="post">
        <div>
          {!postImageLoaded && <div>Loading image...</div>}

          <img
            key={featuredImage}
            src={featuredImage}
            alt={title}
            crossOrigin="anonymous"
            style={{
              maxWidth: `100%`,
              height: `auto`,
              opacity: postImageLoaded ? 1 : 0,
              transition: "all 500ms ease",
            }}
          />

          {!!postImageColorPalette && postImageLoaded && (
            <div className="palette">
              {postImageColorPalette.map((color, index) => {
                return (
                  <div
                    key={index}
                    className="color-palette__item"
                    style={{
                      background: `rgb(${color.join(",")})`,
                    }}
                  ></div>
                );
              })}
            </div>
          )}
        </div>
        <h2>{title}</h2>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div>{date}</div>
        <div>{resume}</div>
        <div>{rating}</div>
      </article>
      {previousPost && (
        <Link
          href="/posts/[slug]"
          as={`/posts/${previousPost.attributes.slug}`}
        >
          <a>{previousPost.attributes.title}</a>
        </Link>
      )}
      {nextPost && (
        <Link href="/posts/[slug]" as={`/posts/${nextPost.attributes.slug}`}>
          <a>{nextPost.attributes.title}</a>
        </Link>
      )}
    </>
  );
};

Post.getInitialProps = async (context) => {
  const {
    query: { slug },
  } = context;

  const posts = {};

  function importAll(r) {
    r.keys().forEach((key) => {
      const post = r(key);
      const postSlug = key.substring(2, key.length - 3);
      post.attributes.slug = postSlug;
      posts[postSlug] = post;
    });
  }

  importAll(require.context("../../content/posts", true, /\.md$/));

  const orderedPostsByDate = orderPostsByDate(posts);
  if (slug) {
    const post = await import(`../../content/posts/${slug}.md`);

    const currentPostIndex = orderedPostsByDate.findIndex(
      (p) => p.attributes.slug === slug
    );
    const nextPost = orderedPostsByDate[currentPostIndex + 1] || null;
    const previousPost = orderedPostsByDate[currentPostIndex - 1] || null;

    return {
      post: post.default,
      nextPost,
      previousPost,
      orderedPostsByDate,
    };
  }

  return {};
};

export default Post;
