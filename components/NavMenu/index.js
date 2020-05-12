import React, { useCallback } from "react";

import Link from "next/link";

const NavMenu = ({ theme, setTheme }) => {
  const handleClickOnChangeColorFilterButton = useCallback((event) => {
    document.documentElement.classList.toggle("black-and-white");
  });
  return (
    <div className="navmenu-container">
      <nav className="navmenu">
        <Link href="/">
          <a className="navmenu__title">
            <h1>Places</h1>
          </a>
        </Link>
        <ul className="navmenu__list">
          <li className="navmenu__list__item">
            <button
              type="button"
              className="button navmenu__button navmenu__button--change-theme"
              onClick={(event) => setTheme(theme === "dark" ? "light" : "dark")}
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
        </ul>
      </nav>
    </div>
  );
};

export default NavMenu;
