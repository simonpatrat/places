import React from "react";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill";

import GridItem from "./GridItem";

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nbItems: 0,
      cols: 3,
      enteringItemFrom: "left",
      imagesColors: {},
      imagesLoaded: false,
      loadedImages: [],
      gridList: [],
    };

    this.gridRef = React.createRef();
  }

  handleGridResize = (entries) => {
    this.setState({ cols: this.getNumberOfCols() }, () => {
      this.makeGridColumns();
    });
  };

  getNumberOfCols = () => {
    const { cols: colsFromProps } = this.props;
    const { innerWidth } = window;
    const breakPoints = Object.keys(colsFromProps);

    const currentBreakPoint = Math.min(
      ...breakPoints.filter((bpKey) => {
        return innerWidth <= bpKey;
      })
    );

    const nbCols = colsFromProps[currentBreakPoint];
    return nbCols;
  };

  componentDidMount() {
    const { list } = this.props;
    const nbItems = list.length;
    this.setState({
      nbItems,
    });

    this.makeGridColumns();
    this.handleGridResize();
    const resizeObserver = new ResizeObserver(this.handleGridResize);
    this.gridResizeObserver = resizeObserver;

    if (!!this.gridRef && !!this.gridRef.current) {
      this.gridResizeObserver.observe(this.gridRef.current);
    }
  }

  componentWillUnmount() {
    if (!!this.gridResizeObserver) {
      this.gridResizeObserver.unobserve(this.gridRef.current);
    }
  }

  makeGridColumns = () => {
    const { list } = this.props;
    const { cols } = this.state;
    let gridList = {}; // new Array(cols).fill([]);
    for (let i = 0; i < cols; i++) {
      gridList[`column${i}`] = [];
    }

    list.forEach((item, index) => {
      const inColumn = index % cols;
      gridList[`column${inColumn}`].push(item);
    });

    this.setState({
      gridList: Object.keys(gridList).map((itemKey) => {
        const itemValue = gridList[itemKey];
        return itemValue;
      }),
    });
  };

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

  componentDidUpdate(prevProps, prevState) {
    const { loadedImages, nbItems } = this.state;
    if (loadedImages.length !== prevState.loadedImages.length) {
      if (loadedImages.length === nbItems) {
        this.setState({
          imagesLoaded: true,
        });
      }
    }

    if (prevProps.list !== this.props.list) {
      this.makeGridColumns();
    }
  }

  handleImageLoad = ({ image, postSlug }) => {
    const { loadedImages } = this.state;
    const newLoadedImages = [
      ...loadedImages,
      {
        image,
        postSlug,
      },
    ];
    this.setState({
      loadedImages: newLoadedImages,
    });
  };

  render() {
    const { list, debuggModeInCards, withColorPalette } = this.props;
    const { imagesLoaded, gridList, cols } = this.state;

    const gridClassnames = `grid ${imagesLoaded ? "images-loaded" : ""}`;

    return (
      <>
        <div className="grid-wrapper">
          <ul className={gridClassnames} ref={this.gridRef}>
            {gridList.length > 0 &&
              gridList.map((col, colIndex) => {
                return (
                  <div
                    className="grid__col"
                    key={`col-${colIndex}`}
                    style={{
                      width: `calc(100% / ${cols} - 50px)`,
                      flexBasis: `calc(100% / ${cols} - 50px)`,
                    }}
                  >
                    {col.map((item, index) => {
                      const {
                        attributes: { slug, featuredImage, title },
                      } = item;
                      const featuredImageThumbnail = featuredImage.replace(
                        /w_1920/gi,
                        "w_480"
                      );
                      const key = slug + "#" + index;
                      return (
                        <GridItem
                          key={key}
                          index={index}
                          slug={slug}
                          featuredImage={featuredImageThumbnail}
                          title={title}
                          withColorPalette={withColorPalette}
                          imagesLoaded={imagesLoaded}
                          debuggModeInCards={debuggModeInCards}
                          onMouseEnter={this.handleItemMouseEnter}
                          onImageLoadCallBack={this.handleImageLoad}
                        />
                      );
                    })}
                  </div>
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
  debuggModeInCards: PropTypes.bool,
};

export default Grid;
