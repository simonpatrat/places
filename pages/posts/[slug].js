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

import PostHeaderBg from "../../components/PostHeaderBg";
import PostNavigation from "../../components/PostNavigation";
import PostImageInformation from "../../components/PostImageInformations";
import PostMap from "../../components/PostMap";
import PostImageContainer from "../../components/PostImageContainer";
import PostBody from "../../components/PostBody";

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
    featuredImageData,
    // TODO: Add exif data at builde time to retreive GPS coordinates
  } = post;

  const postImageRef = useRef(null);

  const { theme } = useContext(ThemeContext);
  const { colors, setColor } = useContext(ColorsContext);
  // featuredImageData.imageColors ||
  const imageColors =
    featuredImageData.imageColors ||
    (colors && colors[`image-${slug}`] ? colors[`image-${slug}`] : null);

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
    return () => {
      setPostImageLoaded(false);
    };
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
      ? imageColors.color //`rgb(${imageColors.color.join(",")})`
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
        <PostHeaderBg postImageColor={postImageColor} />
        <PostImageContainer
          postImageLoaded={postImageLoaded}
          postImageRef={postImageRef}
          title={title}
          handleImageLoad={handleImageLoad}
          featuredImage={featuredImage}
        >
          <PostNavigation
            previousPost={previousPost}
            nextPost={nextPost}
            isOverImage
          />
        </PostImageContainer>
        <PostImageInformation postImageColorPalette={postImageColorPalette} />
        <div className="container">
          <div className="row">
            <PostBody
              title={title}
              postDate={postDate}
              html={html}
              resume={resume}
            />
          </div>
        </div>
        <div className="container">
          <div className="row">
            <PostMap mapRef={mapRef} postImageColor={postImageColor} />
          </div>
        </div>
      </article>

      <div className="container">
        <div className="row">
          <PostNavigation
            previousPost={previousPost}
            nextPost={nextPost}
            displayTitles
          />
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

  async function importAll(r) {
    r.keys().forEach((key) => {
      const post = r(key);
      const postSlug = key.substring(2, key.length - 3);
      post.attributes.slug = postSlug;
      posts[postSlug] = post;
    });
  }

  async function importAllPostAdditionalImageData(r) {
    const dataFilesToLoad = r.keys();
    dataFilesToLoad.forEach((key) => {
      const jsonFile = r(key);
      const { colors } = jsonFile;
      const palette = colors.map((c) => c[0]).slice(0, 5);
      const dominante = palette[0];
      const imageColorsInfo = {
        color: dominante,
        palette,
      };

      // console.log({jsonFile});
      const postSlug = key.substring(2, key.length - 10);
      // console.log({postSlug})
      posts[postSlug] = {
        ...posts[postSlug],
        featuredImageData: {
          ...jsonFile,
          imageColors: imageColorsInfo,
        },
      };
    });
  }

  if (slug) {
    await importAll(require.context("../../content/posts", true, /\.md$/));
    await importAllPostAdditionalImageData(
      require.context("../../content/posts", true, /\.json$/)
    );

    const orderedPostsByDate = orderPostsByDate(posts);

    const post = posts[slug];

    const currentPostIndex = orderedPostsByDate.findIndex(
      (p) => p.attributes.slug === slug
    );
    const nextPost = orderedPostsByDate[currentPostIndex + 1] || null;
    const previousPost = orderedPostsByDate[currentPostIndex - 1] || null;

    return {
      post,
      nextPost,
      previousPost,
      orderedPostsByDate,
    };
  }

  return {};
};

export default Post;
