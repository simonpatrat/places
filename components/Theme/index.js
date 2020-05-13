import React from "react";
import ThemeContext from "../ThemeContext";

class Theme extends React.Component {
  state = {
    value: {
      theme: "light",
      currentAccentColor: "white",
    },
  };

  setCurrentAccentColor = (color) => {
    this.setState(
      {
        value: {
          ...this.state.value,
          currentAccentColor: color,
        },
      },
      () => {
        // document.documentElement.style.setProperty("--background-color", color);
      }
    );
  };

  setTheme = (themeName) => {
    this.setState({
      value: {
        ...this.state.value,
        theme: themeName,
      },
    });
    const classNamesToRemove = [...document.documentElement.classList].filter(
      (className) => {
        return className.includes("-mode");
      }
    );

    classNamesToRemove.forEach((c) => {
      document.documentElement.classList.remove(c);
    });
    document.documentElement.classList.add(`${themeName}-mode`);
  };

  handleSetTheme = (themeName, accentColor) => {
    this.setTheme(themeName);
    if (accentColor) {
      this.setCurrentAccentColor(accentColor);
    }
  };

  render() {
    return (
      <ThemeContext.Provider
        value={{
          ...this.state.value,
          setTheme: this.handleSetTheme,
          setCurrentAccentColor: this.setCurrentAccentColor,
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default Theme;
