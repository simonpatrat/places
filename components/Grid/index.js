import React from "react";
import PropTypes from "prop-types";

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
    };

    this.gridRef = React.createRef();
  }

  handleGridResize = (entries) => {
    const gridElement = entries ? [...entries][0].target : this.gridRef.current;
    if (gridElement) {
      const gridElementSize = gridElement.offsetWidth;
      const itemSize = gridElement.querySelector(".item").offsetWidth;
      const nbCols = Math.floor(gridElementSize / itemSize);

      this.setState({ cols: nbCols });
    }
  };

  async componentDidMount() {
    const { list, cols: colsFromProps, withColorPalette } = this.props;
    const nbItems = list.length;
    this.setState({
      nbItems,
    });
    /*     const images = list.map((it) => it.attributes.featuredImage);
    const allImages = await loadAllImages(images);
    const imagesColors = allImages.reduce((acc, next) => {
      acc[next.imageId] = next;
      return acc;
    }, {}); */
    /*
    this.setState({
      imagesLoaded: true,
      imagesColors,
    }); */

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
  }

  handleImageLoad = ({ image, postSlug }) => {
    console.log("Loaded image");
    const { loadedImages } = this.state;
    console.log(typeof loadedImages, loadedImages);
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
    const { imagesLoaded } = this.state;

    const gridClassnames = `grid ${imagesLoaded ? "images-loaded" : ""}`;

    return (
      <>
        <div className="grid-wrapper">
          <ul className={gridClassnames} ref={this.gridRef} style={{}}>
            {list.map((item, index) => {
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
