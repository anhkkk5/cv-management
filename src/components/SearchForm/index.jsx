import React from "react";
import { Row, Col } from "antd";
import { ProfileOutlined, BankOutlined, TeamOutlined, InboxOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {getAlljob} from "../../services/jobServices/jobServices";
import SearchListJob from "./searchJob";
import heroImg from "../../assets/anh1.png";
import "./style.css";

function Search() {
  const navigate = useNavigate();

  const suggestions = [
    { label: "Thiết kế" },
    { label: "Lập trình", highlighted: true },
    { label: "Marketing số" },
    { label: "Video" },
    { label: "Hoạt hình" },
  ];

  const handleSuggestionClick = (text) => {
    navigate(`/search?city=&keyword=${encodeURIComponent(text)}`);
  };

  const stats = [
    { icon: <ProfileOutlined />, number: "1,75,324", label: "Việc làm", variant: "soft" },
    { icon: <BankOutlined />, number: "97,354", label: "Công ty", variant: "filled" },
    { icon: <TeamOutlined />, number: "38,47,154", label: "Ứng viên", variant: "soft" },
    { icon: <InboxOutlined />, number: "7,532", label: "Việc mới", variant: "soft" },
  ];

  return (
    <div className="search-job-container">
      <Row gutter={[24, 24]} align="middle" className="hero-section">
        <Col xs={24} md={14} className="hero-content">
          <h1 className="hero-title">
            Tìm kiếm công việc phù hợp với năng lực của bạn cùng chúng tôi
          </h1>
          <p className="hero-description">
            Chúng tôi cung cấp nền tảng kết nối doanh nghiệp và ứng viên, giúp bạn tìm được công việc phù hợp với kỹ năng và mong muốn của mình.
          </p>

          <div className="search-form-container">
            <div className="search-form">
              <SearchListJob reverse={true} />
            </div>
          </div>

          <div className="suggestions">
            <span className="suggestions-label">Gợi ý:</span>
            {suggestions.map((s, idx) => (
              <span
                key={s.label}
                className={`suggestion-item ${s.highlighted ? "highlighted" : ""}`}
                onClick={() => handleSuggestionClick(s.label)}
              >
                {s.label}
                {idx < suggestions.length - 1 ? "," : ""}
              </span>
            ))}
          </div>
        </Col>
        <Col xs={24} md={10} className="hero-illustration">
          <img src={heroImg} alt="Hero" className="illustration-image" />
        </Col>
      </Row>

      <Row gutter={[20, 20]} className="stats-section">
        {stats.map((item) => (
          <Col key={item.label} xs={12} sm={12} md={6}>
            <div className="stat-card">
              <div className="stat-content-left">
                <div className={`stat-icon-box ${item.variant === "filled" ? "filled" : "soft"}`}>
                  <span className="stat-icon">{item.icon}</span>
                </div>
                <div className="stat-text">
                  <div className="stat-number">{item.number}</div>
                  <div className="stat-label">{item.label}</div>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
export default Search;
