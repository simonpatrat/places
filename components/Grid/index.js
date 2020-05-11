import React from "react";
import PropTypes from "prop-types";

import GridItem from "./GridItem";

import { loadAllImages } from "./lib/helpers/imagesLoaded";

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nbItems: 0,
      cols: 4,
      enteringItemFrom: "left",
      imagesColors: {},
      imagesLoaded: false,
    };

    this.gridRef = React.createRef();
  }

  handleGridResize = (entries) => {
    const { cols: colsFromProps } = this.props;
    const { innerWidth } = window;
    const breakPoints = Object.keys(colsFromProps);

    const currentBreakPoint = Math.min(
      ...breakPoints.filter((bpKey) => {
        return innerWidth <= bpKey;
      })
    );
    const nbCols = colsFromProps[currentBreakPoint];
    this.setState({ cols: nbCols });
  };

  async componentDidMount() {
    const { list, cols: colsFromProps, withColorPalette } = this.props;
    const nbItems = list.length;
    this.setState({
      nbItems,
    });
    const images = list.map((it) => it.attributes.featuredImage);
    const allImages = await loadAllImages(images);
    const imagesColors = allImages.reduce((acc, next) => {
      acc[next.imageId] = next;
      return acc;
    }, {});

    this.setState({
      imagesLoaded: true,
      imagesColors,
    });

    if (
      typeof colsFromProps !== "number" &&
      !!colsFromProps &&
      typeof colsFromProps === "object"
    ) {
      this.handleGridResize();
      const resizeObserver = new ResizeObserver(this.handleGridResize);
      this.gridResizeObserver = resizeObserver;

      if (!!this.gridRef && !!this.gridRef.current) {
        this.gridResizeObserver.observe(this.gridRef.current);
      }
    }
  }

  componentWillUnmount() {
    if (!!this.gridResizeObserver) {
      this.gridResizeObserver.unobserve(this.gridRef.current);
    }
  }

  handleItemMouseEnter = (event, index) => {
    const { pageX, pageY } = event;
    const { target: item } = event;
    const { offsetLeft, offsetWidth, dataset } = item;
    const middle = offsetWidth / 2 + offsetLeft;
    const enterFrom = pageX > middle ? "right" : "left";
    const decalage = enterFrom === "left" ? "10%" : "-10%";

    this.setState({
      enteringItemFrom: enterFrom,
    });

    this.gridRef.current.style.setProperty("--item-hover-right-pos", decalage);
  };

  render() {
    const {
      list,
      gap,
      debuggModeInCards,
      withColorPalette,
      withPadding,
    } = this.props;
    const { cols, imagesColors, imagesLoaded } = this.state;

    const gridClassnames = `grid ${imagesLoaded ? "images-loaded" : ""}`;

    return (
      <>
        <div className="grid-config"></div>
        <div className="grid-wrapper">
          <ul
            className={gridClassnames}
            ref={this.gridRef}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: `${gap}px`,
              padding: withPadding ? `${gap}px` : 0,
              width: "100%",
              maxWidth: "1920px",
              margin: "32px auto",
            }}
          >
            {list.map((item, index) => {
              const columnStart =
                (index + 1) % cols === 0 ? cols : (index + 1) % cols;
              const columnEnd =
                columnStart === cols ? cols : ((index + 1) % cols) + 1;
              const itemClassnames = `item ${
                imagesLoaded ? "images-loaded" : ""
              }`;

              const {
                attributes: { slug, featuredImage, title },
              } = item;
              const imageColorsInfos = imagesColors[`image-${index}`];
              const key = slug + "#" + index;
              return (
                <GridItem
                  key={key}
                  index={index}
                  columnStart={columnStart}
                  columnEnd={columnEnd}
                  itemClassnames={itemClassnames}
                  slug={slug}
                  featuredImage={featuredImage}
                  title={title}
                  imageColorsInfos={imageColorsInfos}
                  withColorPalette={withColorPalette}
                  imagesLoaded={imagesLoaded}
                  debuggModeInCards={debuggModeInCards}
                  onMouseEnter={this.handleItemMouseEnter}
                />
              );
            })}
          </ul>
        </div>
      </>
    );
  }
}

Grid.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object), // TODO: shape
  useImagesLoaded: PropTypes.bool,
  imagesLoaded: PropTypes.bool,
  cols: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  gap: PropTypes.number,
  debuggModeInCards: PropTypes.bool,
  withPadding: PropTypes.bool, // use grid gap as grid padding
};

export default Grid;
