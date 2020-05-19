import Link from "next/link";
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import classnames from "classnames";

import ThemeContext from "../../components/ThemeContext";
import ColorsContext from "../../components/ColorsContext";

import { orderPostsByDate } from "../../lib/orderPostsByDate";
import { lightOrDark } from "../../lib/color";
import { getImageColorInfo } from "../../components/Grid/lib/helpers/imagesColors";
import {
  getImageExifData,
  getImageGPSCoordinatesFromExifData,
} from "../../lib/imageExifData";

const Post = (props) => {
  const { post, nextPost, previousPost } = props;
  let PLACES_LEAFLET_MAP = null;

  if (!props.post) {
    return <div>Loading...</div>;
  }
  const {
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
  } = post;

  const postImageRef = useRef(null);

  const { theme } = useContext(ThemeContext);
  const { colors, setColor } = useContext(ColorsContext);
  const imageColors =
    colors && colors[`image-${slug}`] ? colors[`image-${slug}`] : null;

  const [postImageLoaded, setPostImageLoaded] = useState(false);
  const [postImageGPSCoordinates, setPostImageGPSCoordinates] = useState(null);
  const [displayLargeImage, setDisplayLargeImage] = useState(false);

  const [postDate, setPostDate] = useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
    const makePostMap = () => {
      const coordinatesAsArray = [
        postImageGPSCoordinates.latitude,
        postImageGPSCoordinates.longitude,
      ];

      const coordinatesArray = coordinatesAsArray.map((coordinate) => {
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
      PLACES_LEAFLET_MAP = map;
    };
    const addThemeClassNames = () => {
      document.documentElement.classList.add(`${theme}-mode`);
      const colorBrightness =
        imageColors && imageColors.color
          ? lightOrDark(postImageColor)
          : "light";

      document.documentElement.classList.add(
        `with-photo-color-theme--${colorBrightness}`
      );
    };

    if (postImageGPSCoordinates) {
      makePostMap();
    }

    if (imageColors) {
      addThemeClassNames();
    }

    return () => {
      const classNamesToRemove = [...document.documentElement.classList].filter(
        (c) => {
          return c.includes("with-photo-color-theme");
        }
      );
      if (classNamesToRemove.length > 0) {
        classNamesToRemove.forEach((cn) => {
          document.documentElement.classList.remove(cn);
        });
      }
      if (PLACES_LEAFLET_MAP) {
        PLACES_LEAFLET_MAP.remove();
        PLACES_LEAFLET_MAP = null;
      }
    };
  }, [postImageGPSCoordinates, mapRef, title, imageColors]);

  const handleImageLoad = useCallback(
    async (event) => {
      const image = event.target;

      if (!imageColors) {
        const imageColorsInfo = await getImageColorInfo(image);

        setColor({
          imageId: `image-${slug}`,
          colorInfo: imageColorsInfo,
        });
      }
      const imageExifData = await getImageExifData(image);

      if (Object.keys(imageExifData).length > 0 && imageExifData.GPSLatitude) {
        const imageGPSCoordinates = await getImageGPSCoordinatesFromExifData(
          imageExifData
        );

        setPostImageGPSCoordinates(imageGPSCoordinates);
      } else if (gpsCoordinates) {
        setPostImageGPSCoordinates(
          gpsCoordinates.split(",").reduce((acc, next, index) => {
            if (index === 0) {
              acc.latitude = next;
            } else {
              acc.longitude = next;
            }
            return acc;
          }, {})
        );
      }

      setPostImageLoaded(true);
    },
    [featuredImage, imageColors]
  );

  useEffect(() => {
    const theDate = new Date(date).toLocaleDateString();
    setPostDate(theDate);
    return () =>   {
      setPostImageLoaded(false);
    }
  }, [date]);

  useEffect(() => {
    if (postImageRef.current.complete) {
      const fakeLoadEvent = { target: postImageRef.current };
      handleImageLoad(fakeLoadEvent);
    }

  }, []);

  const handleEnlargeImageButtonClick = useCallback((event) => {
    setDisplayLargeImage(!displayLargeImage);
  });

  const postImageColor =
    imageColors && imageColors.color
      ? `rgb(${imageColors.color.join(",")})`
      : `rgba(0,0,0,0.2)`;

  const postImageColorPalette =
    imageColors && imageColors.palette ? imageColors.palette : null;

  const postClassnames = classnames("post", {
    "with-large-image": displayLargeImage,
    "image-loaded": postImageLoaded,
  });
  return (
    <>
      <article className={postClassnames}>
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
        <div
            className="post__img-container"
        >
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
          {postImageLoaded && (
            <Link href="/">
              <a className="button-close-image" title="Return to home page">
                <span className="las la-times icon"></span>
              </a>
            </Link>
          )}

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
          <button
            style={{
              display: "none",
            }}
            type="button"
            className="button-enlarge-post-image"
            onClick={handleEnlargeImageButtonClick}
            aria-label="Enlarge image"
          >
            <span className="icon las la-expand-arrows-alt"></span>
          </button>

          <div className="post-navigation post-navigation--over-image">
            {nextPost && (
              <Link
                href="/posts/[slug]"
                as={`/posts/${nextPost.attributes.slug}`}
              >
                <a
                  className="post-navigation__link post-navigation__link--next"
                  title={nextPost.attributes.title}
                >
                  <span className="icon las la-arrow-left"></span>
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
                  <span className="icon las la-arrow-right"></span>
                </a>
              </Link>
            )}
            {!previousPost && <div></div>}
          </div>
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
        <div className="container">
          <div className="row">
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
          </div>
        </div>
        <div className="container">
          <div className="row">
            <section
              className="post-map"
              style={{
                background: !!postImageColor ? postImageColor : "transparent",
              }}
            >
              <div className="post-map__inner" ref={mapRef}></div>
            </section>
          </div>
        </div>
      </article>

      <div className="container">
        <div className="row">
          <div className="post-navigation">
            {nextPost && (
              <Link
                href="/posts/[slug]"
                as={`/posts/${nextPost.attributes.slug}`}
              >
                <a className="post-navigation__link post-navigation__link--next">
                  {nextPost.attributes.title}
                  &nbsp;
                  <span className="icon las la-arrow-left"></span>
                </a>
              </Link>
            )}
            {previousPost && (
              <Link
                href="/posts/[slug]"
                as={`/posts/${previousPost.attributes.slug}`}
              >
                <a className="post-navigation__link post-navigation__link--previous">
                  <span className="icon las la-arrow-right"></span>
                  &nbsp;
                  {previousPost.attributes.title}
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
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
