import "./layoutDefault.scss";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import SearchListJob from "../../components/SearchForm/searchJob";
import { getCookie, setCookie } from "../../helpers/cookie";
import { useEffect, useState } from "react";
import { BellOutlined, UserOutlined, ShopOutlined, AppstoreOutlined, HighlightOutlined, StarOutlined, RadarChartOutlined, FileTextOutlined, UploadOutlined, ReadOutlined, EditOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
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
    ...(userType === "candidate"
      ? [
          {
            key: "my-applications",
            label: "Công việc đã ứng tuyển",
            onClick: () => navigate("/applications"),
          },
          {
            key: "saved-jobs",
            label: "Công việc đã lưu",
            onClick: () => navigate("/saved-jobs"),
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
                <NavLink
                  to="/jobs"
                  className="header__top-link header__top-link--active"
                >
                  Việc làm
                </NavLink>
                <NavLink to="/cv" className="header__top-link">
                  CV của bạn
                </NavLink>
                {isLoggedIn && userType === "candidate" && (
                  <Dropdown
                    overlay={
                      <div style={{
                        background: "#fff",
                        padding: 16,
                        borderRadius: 8,
                        boxShadow: "0 12px 24px rgba(0,0,0,.12)",
                        width: 520
                      }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                          <div>
                            <div style={{ color: "#16a34a", fontWeight: 700, marginBottom: 8 }}>Mẫu CV theo style →</div>
                            <div className="createcv-item" onClick={() => navigate("/cv/templates?style=simple")}> <AppstoreOutlined style={{ marginRight: 8 }}/><span>Mẫu CV Đơn giản</span></div>
                            <div className="createcv-item" onClick={() => navigate("/cv/templates?style=impressive")}> <HighlightOutlined style={{ marginRight: 8 }}/><span>Mẫu CV Ấn tượng</span></div>
                            <div className="createcv-item" onClick={() => navigate("/cv/templates?style=professional")}> <StarOutlined style={{ marginRight: 8 }}/><span>Mẫu CV Chuyên nghiệp</span></div>
                            <div className="createcv-item" onClick={() => navigate("/cv/templates?style=modern")}> <RadarChartOutlined style={{ marginRight: 8 }}/><span>Mẫu CV Hiện đại</span></div>

                            <div style={{ color: "#16a34a", fontWeight: 700, margin: "12px 0 8px" }}>Mẫu CV theo vị trí ứng tuyển →</div>
                            <div className="createcv-item" onClick={() => navigate("/cv/templates?role=sales")}> <AppstoreOutlined style={{ marginRight: 8 }}/><span>Nhân viên kinh doanh</span></div>
                            <div className="createcv-item" onClick={() => navigate("/cv/templates?role=developer")}> <AppstoreOutlined style={{ marginRight: 8 }}/><span>Lập trình viên</span></div>
                            <div className="createcv-item" onClick={() => navigate("/cv/templates?role=accounting")}> <AppstoreOutlined style={{ marginRight: 8 }}/><span>Nhân viên kế toán</span></div>
                            <div className="createcv-item" onClick={() => navigate("/cv/templates?role=marketing")}> <AppstoreOutlined style={{ marginRight: 8 }}/><span>Chuyên viên marketing</span></div>
                          </div>
                          <div>
                            <div className="createcv-item" onClick={() => navigate("/cv")}> <FileTextOutlined style={{ marginRight: 8 }}/><span>Quản lý CV</span></div>
                            <div className="createcv-item" onClick={() => navigate("/cv/templates")}> <UploadOutlined style={{ marginRight: 8 }}/><span>Tải CV lên</span></div>
                            <div className="createcv-item" onClick={() => navigate("/cv/guide")}> <ReadOutlined style={{ marginRight: 8 }}/><span>Hướng dẫn viết CV</span></div>
                            <div className="createcv-item" onClick={() => navigate("/cv/cover-letter")}> <EditOutlined style={{ marginRight: 8 }}/><span>Quản lý Cover Letter</span></div>
                            <div className="createcv-item" onClick={() => navigate("/cv/cover-letter/templates")}> <EditOutlined style={{ marginRight: 8 }}/><span>Mẫu Cover Letter</span></div>
                          </div>
                        </div>
                        <style>{`
                          .createcv-item { display:flex; align-items:center; padding:6px 8px; border-radius:6px; cursor:pointer; }
                          .createcv-item:hover { background:#f5f5f5; }
                        `}</style>
                      </div>
                    }
                    trigger={["hover"]}
                    placement="bottom"
                  >
                    <span className="header__top-link" style={{ cursor: "pointer" }}>
                      Tạo CV
                    </span>
                  </Dropdown>
                )}
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
                      overlay={
                        <Menu>
                          {companies.length > 0 ? (
                            companies.map((company) => (
                              <Menu.Item
                                key={company.id}
                                onClick={() =>
                                  navigate(`/companies/${company.id}`)
                                }
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
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
