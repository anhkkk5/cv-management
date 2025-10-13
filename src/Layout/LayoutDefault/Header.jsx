import "./layoutDefault.scss";
import { NavLink } from "react-router-dom";
import SearchListJob from "../../components/SearchJob/searchJob";

function Header() {
  return (
    <header className="header">
      {/* Top Bar */}
      <div className="header__top-bar">
        <div className="header__top-bar-content">
          <nav className="header__top-nav">
            <NavLink to="/" className="header__top-link">
              Trang chủ
            </NavLink>
            <NavLink
              to="/jobs"
              className="header__top-link header__top-link--active"
            >
              Việc làm
            </NavLink>
            <NavLink to="/cv" className="header__top-link">
              CV của bạn
            </NavLink>
            <NavLink to="/support" className="header__top-link">
              Customer Supports
            </NavLink>
          </nav>
          <div className="header__top-contact">
            <span className="header__phone">
              <i className="header__phone-icon">📞</i>
              +1-202-555-0178
            </span>
            <div className="header__language">
              <span className="header__flag">🇺🇸</span>
              <span>English</span>
              <span className="header__dropdown">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header__main">
        <div className="header__main-content">
          {/* Logo */}
          <div className="header__logo">
            <NavLink to="/" className="header__logo-link">
              <span className="header__logo-rikei">RIKEI</span>
              <span className="header__logo-edu">Edu</span>
              <span className="header__logo-icon">🌿</span>
            </NavLink>
            <p className="header__tagline">where dreams come true</p>
          </div>

          {/* Search Bar */}
          <div className="header__search">
            <SearchListJob />
          </div>

          {/* Action Buttons */}
          <div className="header__actions">
            <button className="header__btn header__btn--login">
              Đăng Nhập
            </button>
            <button className="header__btn header__btn--register">
              Đăng Kí
            </button>
            <button className="header__btn header__btn--post">
              Đăng Tuyển
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
