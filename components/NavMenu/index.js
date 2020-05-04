import Link from "next/link";

const NavMenu = (props) => {
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
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavMenu;
