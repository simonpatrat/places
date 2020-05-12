import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

const GridItem = ({
  index,
  columnStart,
  columnEnd,
  itemClassnames,
  slug,
  featuredImage,
  title,
  imageColorsInfos,
  withColorPalette,
  imagesLoaded,
  debuggModeInCards,
  onMouseEnter,
  url,
}) => {
  const itemContent = (
    <>
      <div className="img-container">
        {withColorPalette && (
          <div
            className="img-container__bg"
            style={{
              background: `${
                !!imageColorsInfos && !!imageColorsInfos.color
                  ? "rgb(" + imageColorsInfos.color.join(",") + ")"
                  : "#f7f8f9"
              }`,
              transitionDelay: `${index * 100}ms`,
            }}
          >
            <div
              className="item__overlay"
              style={{
                transform: imagesLoaded ? `translateY(-110%)` : "none",
                // opacity: imagesLoaded ? 0 : 1,
                transitionDelay: `${index * 100}ms`,
              }}
            />
          </div>
        )}
        <div className="img-container__inner">
          <img
            {...(withColorPalette && {
              crossOrigin: "anonymous",
            })}
            src={featuredImage}
            alt={title}
            className={imagesLoaded ? "loaded" : ""}
            // onLoad={(event) => this.handleImageLoad(event, index)}
          />
          <div
            className="item__overlay"
            style={{
              transform: imagesLoaded ? `translateY(-110%)` : "none",
              // opacity: imagesLoaded ? 0 : 1,
              transitionDelay: `${index * 100}ms`,
            }}
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
      style={{
        gridColumnStart: `${columnStart}`,
        gridColumnEnd: `${columnEnd}`,
      }}
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
  columnStart: PropTypes.number.isRequired,
  columnEnd: PropTypes.number.isRequired,
  itemClassnames: PropTypes.string.isRequired,
  featuredImage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  imageColorsInfos: PropTypes.object,
  withColorPalette: PropTypes.bool,
  imagesLoaded: PropTypes.bool,
  debuggModeInCards: PropTypes.bool,
  slug: PropTypes.string,
  url: PropTypes.string,
};

export default GridItem;
