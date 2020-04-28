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
          {postImageLoaded ? (
            <img
              ref={postImage}
              src={featuredImage}
              alt={title}
              crossOrigin="anonymous"
              style={{
                width: "600px",
                maxWidth: `100%`,
                height: `auto`,
              }}
            />
          ) : (
            <div>Loading image...</div>
          )}

          {!!postImageColorPalette &&
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
    </>
  );
};

Post.getInitialProps = async (ctx) => {
  const {
    query: { slug },
  } = ctx;

  if (slug) {
    const post = await import(`../../content/posts/${slug}.md`);
    return { post };
  }
  return {};
};

export default Post;
