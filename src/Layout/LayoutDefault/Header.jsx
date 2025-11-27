import "./layoutDefault.scss";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import SearchListJob from "../../components/SearchForm/searchJob";
import { getCookie, setCookie } from "../../helpers/cookie";
import { useEffect, useState } from "react";
import {
  BellOutlined,
  BookOutlined,
  CrownOutlined,
  FileTextOutlined,
  LikeOutlined,
  SearchOutlined,
  ShopOutlined,
  UnorderedListOutlined,
  UserOutlined,
  WalletOutlined,
  CalculatorOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  MobileOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import { getAllCompany, getMyCompany } from "../../services/getAllCompany/companyServices";
import { getMyCandidateProfile } from "../../services/Candidates/candidatesServices";
import { decodeJwt } from "../../services/auth/authServices";
import logoImage from "../../assets/logologin.png";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState([]);
  const [isJobMenuOpen, setIsJobMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

  const jobShortcuts = [
    { key: "search-job", icon: <SearchOutlined />, label: "Tìm việc làm", path: "/jobs" },
    { key: "saved", icon: <BookOutlined />, label: "Việc làm đã lưu", path: "/saved-jobs" },
    { key: "applied", icon: <FileTextOutlined />, label: "Việc làm đã ứng tuyển", path: "/jobs" },
    { key: "match", icon: <LikeOutlined />, label: "Việc làm phù hợp", path: "/jobs" },
  ];

  const toolShortcuts = [
    { key: "gross-net", icon: <WalletOutlined />, label: "Tính lương Gross - Net", path: "/gross-net" },
    { key: "tax", icon: <CalculatorOutlined />, label: "Tính thuế thu nhập cá nhân" },
    { key: "compound", icon: <LineChartOutlined />, label: "Tính lãi suất kép" },
    { key: "unemployment", icon: <SafetyCertificateOutlined />, label: "Tính bảo hiểm thất nghiệp" },
    { key: "social", icon: <SolutionOutlined />, label: "Tính bảo hiểm xã hội một lần" },
    { key: "saving-plan", icon: <CalculatorOutlined />, label: "Lập kế hoạch tiết kiệm" },
    { key: "mobile", icon: <MobileOutlined />, label: "Mobile App TopCV" },
  ];

  const companyShortcuts = [
    { key: "companies", icon: <UnorderedListOutlined />, label: "Danh sách công ty", path: "/companies" },
    { key: "top-companies", icon: <CrownOutlined />, label: "Top công ty", path: "/companies" },
  ];

  const jobPositions = [
    { key: "sales", label: "Việc làm Nhân viên kinh doanh" },
    { key: "accounting", label: "Việc làm Kế toán" },
    { key: "marketing", label: "Việc làm Marketing" },
    { key: "hr", label: "Việc làm Hành chính nhân sự" },
    { key: "customer-care", label: "Việc làm Chăm sóc khách hàng" },
    { key: "banking", label: "Việc làm Ngân hàng" },
    { key: "it", label: "Việc làm IT" },
    { key: "labor", label: "Việc làm Lao động phổ thông" },
    { key: "senior", label: "Việc làm Senior" },
    { key: "construction", label: "Việc làm Kỹ sư xây dựng" },
    { key: "design", label: "Việc làm Thiết kế đồ họa" },
    { key: "real-estate", label: "Việc làm Bất động sản" },
    { key: "education", label: "Việc làm Giáo dục" },
    { key: "telesales", label: "Việc làm telesales" },
  ];

  useEffect(() => {
    const cookieToken = getCookie("token");
    const lsToken = localStorage.getItem("token");
    const token = cookieToken || lsToken || "";

    if (!token) {
      setIsLoggedIn(false);
      setUserType("");
      setUserName("");
      setCompanyId("");
      return;
    }

    setIsLoggedIn(true);

    let type = getCookie("userType");
    if (!type) {
      try {
        const payload = decodeJwt(token);
        type = payload?.role || "";
      } catch (_e) {
        type = "";
      }
    }
    setUserType(type);

    const fullName = getCookie("fullName");
    const companyName = getCookie("companyName");
    const id = getCookie("companyId");

    const name = type === "candidate" ? fullName : type === "admin" ? fullName : companyName;
    setUserName(name || "");
    if (type === "company" && id) {
      setCompanyId(id);
    }
  }, [location.pathname]);

  // Auto fetch my company if logged in as company but missing cache
  useEffect(() => {
    const maybeFetch = async () => {
      const token = getCookie("token") || localStorage.getItem("token");
      const type = getCookie("userType") || (token ? decodeJwt(token)?.role : "");
      const cachedId = getCookie("companyId");
      const cachedName = getCookie("companyName");
      if (!token || type !== "company" || (cachedId && cachedName)) return;
      try {
        const comp = await getMyCompany();
        if (comp?.id) {
          setCookie("companyId", comp.id, 1);
          if (comp.companyName || comp.fullName) {
            setCookie("companyName", comp.companyName || comp.fullName, 1);
          }
          setCompanyId(String(comp.id));
          setUserName(comp.companyName || comp.fullName || "");
        }
      } catch (e) {
        // ignore; user may not have company yet
      }
    };
    maybeFetch();
    // run once on mount and when auth changes by route change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto fetch candidate name if logged in as candidate but missing name
  useEffect(() => {
    const loadCandidateName = async () => {
      const token = getCookie("token") || localStorage.getItem("token");
      const type = getCookie("userType") || (token ? decodeJwt(token)?.role : "");
      const fullName = getCookie("fullName");
      if (!token || type !== "candidate" || fullName) return;
      try {
        const me = await getMyCandidateProfile();
        if (me?.fullName) {
          setCookie("fullName", me.fullName, 1);
          setUserName(me.fullName);
        }
      } catch (_e) {
        // ignore
      }
    };
    loadCandidateName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleNavigateAndClose = (path) => {
    if (path) {
      navigate(path);
    }
    setIsJobMenuOpen(false);
    setIsToolsMenuOpen(false);
  };

  const handleGoCompany = async () => {
    if (companyId) {
      navigate(`/companies/${companyId}`);
      return;
    }
    try {
      const comp = await getMyCompany();
      if (comp?.id) {
        // cache for next times
        setCookie("companyId", comp.id, 1);
        if (comp.companyName || comp.fullName) {
          setCookie("companyName", comp.companyName || comp.fullName, 1);
        }
        navigate(`/companies/${comp.id}`);
      }
    } catch (e) {
      const status = e?.response?.status;
      if (status === 404) {
        // Chưa có thông tin doanh nghiệp -> chuyển tới trang đăng ký công ty
        navigate("/registerCompany");
        return;
      }
      // eslint-disable-next-line no-console
      console.error("Cannot fetch my company:", e);
    }
  };

  const userMenuItems = [
    ...(userType === "company"
      ? [
          {
            key: "my-company",
            label: "Thông tin doanh nghiệp",
            onClick: handleGoCompany,
          },
        ]
      : []),
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
            {userType === "admin" ? (
              // Admin menu
              <>
                <NavLink
                  to="/"
                  className={`header__top-link ${
                    location.pathname === "/" ? "header__top-link--active" : ""
                  }`}
                >
                  Trang chủ
                </NavLink>
                <NavLink
                  to="/admin/jobs"
                  className={`header__top-link ${
                    location.pathname.includes("/admin/jobs")
                      ? "header__top-link--active"
                      : ""
                  }`}
                >
                  Quản lý việc làm
                </NavLink>
                <NavLink
                  to="/admin/companies"
                  className={`header__top-link ${
                    location.pathname.includes("/admin/companies")
                      ? "header__top-link--active"
                      : ""
                  }`}
                >
                  Quản lý công ty
                </NavLink>
                <NavLink
                  to="/admin/users"
                  className={`header__top-link ${
                    location.pathname.includes("/admin/users")
                      ? "header__top-link--active"
                      : ""
                  }`}
                >
                  Quản lý người dùng
                </NavLink>
              </>
            ) : (
              // Regular menu
              <>
                <NavLink to="/" className="header__top-link">
                  Trang chủ
                </NavLink>
                <div
                  className={`header__job-menu ${isJobMenuOpen ? "header__job-menu--open" : ""}`}
                  onMouseEnter={() => setIsJobMenuOpen(true)}
                  onMouseLeave={() => setIsJobMenuOpen(false)}
                >
                  <NavLink
                    to="/jobs"
                    className={`header__top-link ${
                      location.pathname.startsWith("/jobs") || location.pathname.startsWith("/job")
                        ? "header__top-link--active"
                        : ""
                    }`}
                  >
                    Việc làm
                  </NavLink>
                  <div
                    className="header__job-dropdown"
                    onMouseEnter={() => setIsJobMenuOpen(true)}
                    onMouseLeave={() => setIsJobMenuOpen(false)}
                  >
                    <div className="header__job-dropdown-left">
                      <div className="header__job-group">
                        <div className="header__job-group-title">VIỆC LÀM</div>
                        <div className="header__job-list">
                          {jobShortcuts.map((item) => (
                            <button
                              key={item.key}
                              type="button"
                              className="header__job-item"
                              onClick={() => handleNavigateAndClose(item.path)}
                            >
                              <span className="header__job-item-icon">{item.icon}</span>
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="header__job-group">
                        <div className="header__job-group-title">CÔNG TY</div>
                        <div className="header__job-list">
                          {companyShortcuts.map((item) => (
                            <button
                              key={item.key}
                              type="button"
                              className="header__job-item"
                              onClick={() => handleNavigateAndClose(item.path)}
                            >
                              <span className="header__job-item-icon">{item.icon}</span>
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="header__job-dropdown-right">
                      <div className="header__job-group-title header__job-group-title--muted">
                        VIỆC LÀM THEO VỊ TRÍ
                      </div>
                      <div className="header__job-position-grid">
                        {jobPositions.map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            className="header__job-position"
                            onClick={() => handleNavigateAndClose("/jobs")}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className={`header__tools-menu ${isToolsMenuOpen ? "header__tools-menu--open" : ""}`}
                  onMouseEnter={() => setIsToolsMenuOpen(true)}
                  onMouseLeave={() => setIsToolsMenuOpen(false)}
                >
                  <span className="header__top-link" style={{ cursor: "pointer" }}>
                    Công cụ
                  </span>
                  <div
                    className="header__tools-dropdown"
                    onMouseEnter={() => setIsToolsMenuOpen(true)}
                    onMouseLeave={() => setIsToolsMenuOpen(false)}
                  >
                    <div className="header__tools-title">CÔNG CỤ</div>
                    <div className="header__tools-grid">
                      {toolShortcuts.map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          className="header__tools-item"
                          onClick={() => handleNavigateAndClose(item.path)}
                        >
                          <span className="header__tools-icon">{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <NavLink to="/cv" className="header__top-link">
                  CV của bạn
                </NavLink>
                {isLoggedIn ? (
                  userType === "company" ? (
                    // If logged in as company, navigate directly to company detail
                    <span
                      className="header__top-link"
                      style={{ cursor: "pointer" }}
                      onClick={handleGoCompany}
                    >
                      Thông tin doanh nghiệp
                    </span>
                  ) : (
                    // If logged in as candidate, show dropdown with all companies
                    <Dropdown
                      menu={{
                        items:
                          companies.length > 0
                            ? companies.map((company) => ({
                                key: company.id,
                                label: (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                    }}
                                    onClick={() =>
                                      navigate(`/companies/${company.id}`)
                                    }
                                  >
                                    <ShopOutlined />
                                    <span>{company.fullName}</span>
                                  </div>
                                ),
                              }))
                            : [
                                {
                                  key: "empty",
                                  label: "Không có công ty nào",
                                  disabled: true,
                                },
                              ],
                      }}
                      trigger={["click"]}
                    >
                      <span
                        className="header__top-link"
                        style={{ cursor: "pointer" }}
                      >
                        Thông tin doanh nghiệp
                      </span>
                    </Dropdown>
                  )
                ) : (
                  <NavLink to="/support" className="header__top-link">
                    Customer Supports
                  </NavLink>
                )}
              </>
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
              <div
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <BellOutlined
                  style={{
                    fontSize: "24px",
                    color: "#c41e3a",
                    cursor: "pointer",
                  }}
                />
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#c41e3a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <UserOutlined style={{ fontSize: "20px" }} />
                    </div>
                    <span style={{ color: "#c41e3a", fontWeight: "500" }}>
                      {userName}
                    </span>
                  </div>
                </Dropdown>
              </div>
            ) : isLoggedIn && userType === "company" ? (
              // Logged in as Company
              <div
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <BellOutlined
                  style={{
                    fontSize: "24px",
                    color: "#c41e3a",
                    cursor: "pointer",
                  }}
                />
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#c41e3a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <UserOutlined style={{ fontSize: "20px" }} />
                    </div>
                    <span style={{ color: "#c41e3a", fontWeight: "500" }}>
                      {userName}
                    </span>
                  </div>
                </Dropdown>
              </div>
            ) : isLoggedIn && userType === "admin" ? (
              // Logged in as Admin
              <div
                style={{ display: "flex", alignItems: "center", gap: "20px" }}
              >
                <BellOutlined
                  style={{
                    fontSize: "24px",
                    color: "#c41e3a",
                    cursor: "pointer",
                  }}
                />
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        backgroundColor: "#c41e3a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <UserOutlined style={{ fontSize: "20px" }} />
                    </div>
                    <span style={{ color: "#c41e3a", fontWeight: "500" }}>
                      {userName || "Admin"}
                    </span>
                  </div>
                </Dropdown>
              </div>
            ) : (
              // Not logged in
              <>
                <button className="header__btn header__btn--login">
                  <NavLink to="/login">Đăng Nhập</NavLink>
                </button>
                
                <button className="header__btn header__btn--register">
                  <NavLink to="/register">Đăng Kí</NavLink>
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
