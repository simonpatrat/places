import Link from "next/link";
import React, { useState, useEffect, useContext, useRef, useCallback } from "react";

import ThemeContext from "../../components/ThemeContext";
import ColorsContext from '../../components/ColorsContext';

import { orderPostsByDate } from "../../lib/orderPostsByDate";
import { lightOrDark } from "../../lib/color";
import { getImageColorInfo } from "../../components/Grid/lib/helpers/imagesColors";

const Post = (props) => {
  const {
    post: {
      attributes: {
        title,
        featuredImage,
        rating,
        date,
        resume,
        gpsCoordinates,
        slug,
      },
      html,
    },
    nextPost,
    previousPost,
  } = props;

  if (!props.post) {
    return <div>Loading...</div>;
  }

  const { theme } = useContext(ThemeContext);
  const { colors, setColor } = useContext(ColorsContext);
  const imageColors = colors && colors[`image-${slug}`] ? colors[`image-${slug}`] : null;

  const [postImageLoaded, setPostImageLoaded] = useState(false);

  const [postDate, setPostDate] = useState(null);

  const mapRef = useRef(null);



  useEffect(() => {
    const makePostMap = () => {
      const coordinatesArray = gpsCoordinates.split(",").map((coordinate) => {
        return parseFloat(coordinate);
      });

      let endPointLocation = new L.LatLng(...coordinatesArray);
      let map = new L.Map(mapRef.current, {
        center: endPointLocation,
        zoom: 10,
        layers: new L.TileLayer(
          "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png"
        ),
      });
      let marker = new L.Marker(endPointLocation);
      marker.bindPopup(title);
      map.addLayer(marker);
    };
    makePostMap();
  }, [gpsCoordinates, mapRef, title]);

  useEffect(() => {
    document.documentElement.classList.add(`${theme}-mode`);

    return () => {
      document.documentElement.style.setProperty("--background-color", "");
      document.documentElement.style.setProperty("--text-color", "");
    };
  }, [featuredImage, imageColors]);

  const handleImageLoad = useCallback(async (event) => {

    const image = event.target;

    if (!imageColors) {
      const imageColorsInfo = await getImageColorInfo(image);

      setColor({
        imageId: `image-${slug}`,
        colorInfo: imageColorsInfo,
      });
    }

    const colorBrightness = imageColors && imageColors.color ? lightOrDark(postImageColor) : 'light';

    document.documentElement.style.setProperty(
      "--text-color",
      colorBrightness === "dark" ? "white" : "rgb(10, 1, 32)"
    );

    setPostImageLoaded(true);
  }, [featuredImage, imageColors]);

  useEffect(() => {
    const theDate = new Date(date).toLocaleDateString();
    setPostDate(theDate);
  }, [date]);

  const postImageColor = imageColors && imageColors.color ? `rgb(${imageColors.color.join(",")})` : `rgb(0,0,0)`;

  const bgSecondColor = theme === "dark" ? "#1e272e" : "white";
  const postImageColorPalette = imageColors && imageColors.palette ? imageColors.palette : null;

  return (
    <>
      <article className="post">
        <div
          className="post__header-bg"
          style={{
            /*             backgroundImage: `url(${featuredImage})`,
            backgroundSize: "cover", */
            backgroundRepeat: "no-repeat",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            // height: "calc(50vh - 76px)",
            zIndex: 0,
            backgroundColor: postImageColor,
          }}
        ></div>
        {/* <div className="post__content-pusher"></div> */}
        <div className="post__img-container">
          {!postImageLoaded && <div className="loading">Loading image...</div>}
          <img
            key={featuredImage}
            src={featuredImage}
            alt={title}
            style={{
              opacity: postImageLoaded ? 1 : 0,
            }}
            onLoad={handleImageLoad}
            crossOrigin="anonymous"
          />
        </div>
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
                      background: `rgb(${color.join(",")})`,
                    }}
                  ></div>
                );
              })}
            </div>
          )}
        </div>
        <div className="post__body">
          <h2 className="post__title">{title}</h2>
          <div
            className="post__content-html"
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div className="post__date">{postDate}</div>
          <div className="post__resume">{resume}</div>
          <div className="post__rating">{rating}</div>
          <div className="post__gps-coordinates">{gpsCoordinates}</div>
        </div>
        <section className="post-map">
          <div
            className="post-map__inner"
            ref={mapRef}
            style={{ height: "600px" }}
          ></div>
        </section>
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
