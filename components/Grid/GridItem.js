import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import classnames from "classnames";
import Link from "next/link";
import PropTypes from "prop-types";

import Loading from "../Loading";
import { getImageColorInfo } from "./lib/helpers/imagesColors";
import ColorsContext from "../ColorsContext";

const GridItem = ({
  index,
  slug,
  featuredImage,
  title,
  withColorPalette,
  imagesLoaded,
  debuggModeInCards,
  onMouseEnter,
  url,
}) => {
  const colorContext = useContext(ColorsContext);
  const { setColor, colors } = colorContext;
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageEl = useRef(null);
  const imageColors =
    colors && colors[`image-${slug}`] ? colors[`image-${slug}`] : null;

  const onImageLoad = useCallback(async (event) => {
    const image = event.target;

    if (!imageColors) {
      const imageColorsInfo = await getImageColorInfo(image);
      setColor({
        imageId: `image-${slug}`,
        colorInfo: imageColorsInfo,
      });
    }
    setImageLoaded(true);
  }, []);

  /*   useEffect(() => {
    if (imageEl.current.complete) {
      const fakeLoadEvent = { target: imageEl.current };
      onImageLoad(fakeLoadEvent);
    }
  }, []); */

  useEffect(() => {
    const imageObserver = new IntersectionObserver((entries, imgObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.getAttribute("src")) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          // lazyImage.classList.remove("lzy_img");
          imgObserver.unobserve(lazyImage);
        }
      });
    });
    if (imageEl.current) {
      imageObserver.observe(imageEl.current);
    }

    return () => {
      // imageObserver.unobserve();
    };
  }, []);

  const itemClassnames = classnames("item grid__item", {
    ["all-images-loaded"]: imagesLoaded,
    ["image-loaded"]: imageLoaded,
  });

  const imageContainerBgClassNames = classnames("img-container__bg", {
    ["colors-loaded"]: imageColors && !!imageColors.color,
  });

  const itemContent = (
    <>
      <div className="img-container">
        {withColorPalette && (
          <>
            <div
              className="img-container__bg--loading"
              style={{
                background:
                  !!imageColors && !!imageColors.color
                    ? "transparent"
                    : "#f7f8f9",
              }}
            ></div>
            <div
              className={imageContainerBgClassNames}
              style={{
                background: `${
                  !!imageColors && !!imageColors.color
                    ? "rgb(" + imageColors.color.join(",") + ")"
                    : "#f7f8f9"
                }`,
              }}
            >
              {!imageLoaded && <Loading />}
            </div>
          </>
        )}
        <div className="img-container__inner">
          <img
            ref={imageEl}
            {...(withColorPalette && {
              crossOrigin: "anonymous",
            })}
            data-src={featuredImage}
            alt={title}
            className={imageLoaded ? "loaded" : ""}
            onLoad={onImageLoad}
          />
        </div>
        <div className="item__information">
          <h3 className="item__title">{title}</h3>
        </div>
      </div>
    </>
  );

  return (
    <li
      className={itemClassnames}
      data-index={index}
      // onMouseEnter={(event) => onMouseEnter(event, index)}
    >
      {url || slug ? (
        <Link href="/posts/[slug]" as={`/posts/${slug}`}>
          <a className="item__link item__inner">{itemContent}</a>
        </Link>
      ) : (
        <div className="item__inner">{itemContent}</div>
      )}

      {debuggModeInCards && <div className="content"></div>}
    </li>
  );
};

GridItem.propTypes = {
  index: PropTypes.number.isRequired,
  featuredImage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  withColorPalette: PropTypes.bool,
  imagesLoaded: PropTypes.bool,
  debuggModeInCards: PropTypes.bool,
  slug: PropTypes.string,
  url: PropTypes.string,
};

export default GridItem;
