import React from "react";
import ColorsContext from "./index";


class ImageColorsProvider extends React.Component {
    state = {
      value: {
        colors: {},
      }
    };

    setColor = ({
        imageId,
        colorInfo,
    }) => {
      this.setState(
        {
          value: {
            ...this.state.value,
            colors: {
                ...this.state.value.colors,
                [imageId]: colorInfo,
            }
          },
        },
       /*  () => {
          document.documentElement.style.setProperty("--background-color", color);
        } */
      );
    };


    render() {
      return (
        <ColorsContext.Provider
          value={{
            ...this.state.value,
            setColor: this.setColor,
          }}
        >
          {this.props.children}
        </ColorsContext.Provider>
      );
    }
  }

  export default ImageColorsProvider;
