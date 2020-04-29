import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import ColorThief from "colorthief";

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

  const postImage = useRef();
  useEffect(() => {
    // code to run on component mount
    const colorThief = new ColorThief();
    let img = new Image();
    img.crossOrigin = "Anonymous";

    img.addEventListener("load", function () {
      const palette = colorThief.getPalette(img, 5);
      setPostImageColorPalette(palette);
      setPostImageLoaded(true);
    });

    img.crossOrigin = "Anonymous";
    img.src = featuredImage;
  }, []);

  return (
    <>
      <article>
        <h1>{title}</h1>
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div>{date}</div>
        <div>{resume}</div>
        <div>{rating}</div>
        <div>
          {!postImageLoaded && <div>Loading image...</div>}

          <img
            ref={postImage}
            src={featuredImage}
            alt={title}
            crossOrigin="anonymous"
            style={{
              width: "600px",
              maxWidth: `100%`,
              height: `auto`,
              opacity: postImageLoaded ? 1 : 0,
              transition: "all 500ms ease",
            }}
          />

          {!!postImageColorPalette &&
            postImageLoaded &&
            postImageColorPalette.map((color, index) => {
              return (
                <div
                  key={index}
                  style={{
                    width: "20px",
                    height: "20px",
                    padding: "10px",
                    background: `rgba(${color.join(",")})`,
                  }}
                ></div>
              );
            })}
        </div>
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

Post.getInitialProps = async (ctx) => {
  const {
    query: { slug },
  } = ctx;

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

  const orderedPostsByDate = Object.keys(posts)
    .map((postKey, index) => {
      const post = posts[postKey];
      return post;
    })
    .sort((a, b) => {
      return a.attributes.date < b.attributes.date
        ? -1
        : a.attributes.date > b.attributes.date
        ? 1
        : 0;
    });

  if (slug) {
    const post = await import(`../../content/posts/${slug}.md`);

    const currentPostIndex = orderedPostsByDate.findIndex(
      (p) => p.attributes.slug === slug
    );
    const nextPost = orderedPostsByDate[currentPostIndex + 1] || null;
    const previousPost = orderedPostsByDate[currentPostIndex - 1] || null;

    return { post, nextPost, previousPost };
  }

  return {};
};

export default Post;
