import React, { useCallback } from "react";
import Link from "next/link";

import Logo from "../../static/img/logo-large.svg";

const NavMenu = ({ theme, setTheme }) => {
  const handleClickOnChangeColorFilterButton = useCallback(event => {
    document.documentElement.classList.toggle("black-and-white");
  });
  const handleClickOnToggleCategoriesMenuButton = useCallback(event => {
    console.log("TODO: handle categories menu toggling.");
    document.documentElement.classList.toggle("show-filters");
  });

  return (
    <div className="navmenu-container">
      <div className="container">
        <div className="row">
          <nav className="navmenu">
            <Link href="/">
              <a className="navmenu__title">
                <h1 className="" aria-label="Places">
                  <Logo className="site-logo" with="120px" height="60px" />
                </h1>
              </a>
            </Link>
            <ul className="navmenu__list">
              <li className="navmenu__list__item">
                <button
                  type="button"
                  className="button navmenu__button navmenu__button--change-theme"
                  onClick={event =>
                    setTheme(theme === "dark" ? "light" : "dark")
                  }
                  aria-label={`${theme === "dark" ? "Light" : "Dark"} mode`}
                >
                  <span className="las la-adjust icon" />
                </button>
              </li>
              <li className="navmenu__list__item">
                <button
                  type="button"
                  className="button navmenu__button navmenu__button--change-color-filter"
                  onClick={handleClickOnChangeColorFilterButton}
                  aria-label={"Passer en noir et blanc"}
                >
                  <span className="las la-tint-slash icon" />
                </button>
              </li>
              <li className="navmenu__list__item">
                <button
                  type="button"
                  className="button navmenu__button navmenu__button--toggle-categories-menu"
                  onClick={handleClickOnToggleCategoriesMenuButton}
                  aria-label={"Passer en noir et blanc"}
                >
                  <span className="las la-bars icon" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
