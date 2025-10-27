import "./layoutDefault.scss";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import SearchListJob from "../../components/SearchForm/searchJob"
import { getCookie } from "../../helpers/cookie";
import { useEffect, useState } from "react";
import { BellOutlined, UserOutlined, ShopOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { getAllCompany } from "../../services/getAllCompany/companyServices";
import logoImage from "../../assets/logologin.png";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const token = getCookie("token");
    const type = getCookie("userType");
    const fullName = getCookie("fullName");
    const companyName = getCookie("companyName");
    const id = getCookie("id");
    
    if (token) {
      setIsLoggedIn(true);
      setUserType(type);
      const name = type === "candidate" ? fullName : companyName;
      setUserName(name);
      if (type === "company" && id) {
        setCompanyId(id);
      }
    } else {
      // Reset state when no token (logged out)
      setIsLoggedIn(false);
      setUserType("");
      setUserName("");
      setCompanyId("");
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const result = await getAllCompany();
        if (result) {
          setCompanies(result);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    
    // Only fetch companies list if logged in as candidate
    if (isLoggedIn && userType === "candidate") {
      fetchCompanies();
    }
  }, [isLoggedIn, userType]);

  const handleLogout = () => {
    navigate("/logout");
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      onClick: () => navigate("/profile"),
    },
    {
      key: "logout",
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

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
            {isLoggedIn ? (
              userType === "company" ? (
                // If logged in as company, navigate directly to company detail
                <span 
                  className="header__top-link" 
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/companies/${companyId}`)}
                >
                  Thông tin doanh nghiệp
                </span>
              ) : (
                // If logged in as candidate, show dropdown with all companies
                <Dropdown
                  overlay={
                    <Menu>
                      {companies.length > 0 ? (
                        companies.map((company) => (
                          <Menu.Item
                            key={company.id}
                            onClick={() => navigate(`/companies/${company.id}`)}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <ShopOutlined />
                              <span>{company.fullName}</span>
                            </div>
                          </Menu.Item>
                        ))
                      ) : (
                        <Menu.Item disabled>
                          <span>Không có công ty nào</span>
                        </Menu.Item>
                      )}
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <span className="header__top-link" style={{ cursor: "pointer" }}>
                    Thông tin doanh nghiệp
                  </span>
                </Dropdown>
              )
            ) : (
              <NavLink to="/support" className="header__top-link">
                Customer Supports
              </NavLink>
            )}
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
              <img 
                src={logoImage} 
                alt="Logo" 
                className="header__logo-image"
                style={{ height: "60px", objectFit: "contain" }}
              />
            </NavLink>
          </div>

          {/* Search Bar */}
          <div className="header__search">
            <SearchListJob showButton={false} />
          </div>

          {/* Action Buttons */}
          <div className="header__actions">
            {isLoggedIn && userType === "candidate" ? (
              // Logged in as Candidate
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <BellOutlined style={{ fontSize: "24px", color: "#c41e3a", cursor: "pointer" }} />
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#c41e3a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white"
                    }}>
                      <UserOutlined style={{ fontSize: "20px" }} />
                    </div>
                    <span style={{ color: "#c41e3a", fontWeight: "500" }}>{userName}</span>
                  </div>
                </Dropdown>
              </div>
            ) : isLoggedIn && userType === "company" ? (
              // Logged in as Company
              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <BellOutlined style={{ fontSize: "24px", color: "#c41e3a", cursor: "pointer" }} />
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      backgroundColor: "#c41e3a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white"
                    }}>
                      <UserOutlined style={{ fontSize: "20px" }} />
                    </div>
                    <span style={{ color: "#c41e3a", fontWeight: "500" }}>{userName}</span>
                  </div>
                </Dropdown>
              </div>
            ) : (
              // Not logged in
              <>
                <button className="header__btn header__btn--login">
                  <NavLink to="/login">Đăng Nhập</NavLink>
                </button>
                <button
                  className="header__btn header__btn--login"
                  style={{
                    backgroundColor: "red",
                    border: "1px solid",
                  }}
                >
                  <NavLink to="/loginCompany">Đăng Nhập Công Ty</NavLink>
                </button>
                <button className="header__btn header__btn--register">
                  <NavLink to="/register">Đăng Kí</NavLink>
                </button>
                <button className="header__btn header__btn--register">
                  <NavLink to="/registerCompany">Đăng Kí công ty</NavLink>
                </button>
                <button className="header__btn header__btn--post">
                  <NavLink to="/Post">Đăng tuyển</NavLink>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
