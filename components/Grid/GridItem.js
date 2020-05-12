import React, { useState, useEffect, useCallback } from "react";
import classnames from 'classnames';
import { getImageColorInfo } from "./lib/helpers/imagesColors";
import Link from "next/link";
import PropTypes from "prop-types";

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

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageColors, setImageColors] = useState(null);

  useEffect(() => {

  }, []);

  const onImageLoad = useCallback(async (event) => {
    const imageColorsInfo = await getImageColorInfo(event.target);
    setImageColors(imageColorsInfo);
    setTimeout(() => {
      setImageLoaded(true);
    }, 700);
  }, []);

  const itemClassnames = classnames('item', {
    ['all-images-loaded']: imagesLoaded,
    ['image-loaded']: imageLoaded,
  })

  const itemContent = (
    <>
      <div className="img-container">
        {withColorPalette && (
          <div
            className="img-container__bg"
            style={{
              background: `${
                !!imageColors && !!imageColors.color
                  ? "rgb(" + imageColors.color.join(",") + ")"
                  : "#f7f8f9"
              }`,
            }}
          >

          </div>
        )}
        <div className="img-container__inner">
          <img
            {...(withColorPalette && {
              crossOrigin: "anonymous",
            })}
            src={featuredImage}
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
      onMouseEnter={(event) => onMouseEnter(event, index)}
    >
      {url || slug ? (
        <Link href="/posts/[slug]" as={`/posts/${slug}`}>
          <a className="item__link item__inner">{itemContent}</a>
        </Link>
      ) : (
        <div className="item__inner">{itemContent}</div>
      )}

      {debuggModeInCards && (
        <div className="content">
          <div>In Column: {columnStart}</div>
          <div>Column start: {columnStart}</div>
          <div>Column end: {columnEnd}</div>
        </div>
      )}
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
