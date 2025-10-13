import React from "react";
import { Card, Button, Row, Col, Spin, Avatar } from "antd";
import { EnvironmentOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./style.css";

function FeaturedCompanies() {
  const [companies, setCompanies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [companiesRes, addressesRes, locationsRes, jobsRes] =
          await Promise.all([
            fetch("http://localhost:3002/Companies"),
            fetch("http://localhost:3002/Address_Companies"),
            fetch("http://localhost:3002/Locations"),
            fetch("http://localhost:3002/Jobs"),
          ]);
        const [companiesData, addressesData, locationsData, jobsData] =
          await Promise.all([
            companiesRes.json(),
            addressesRes.json(),
            locationsRes.json(),
            jobsRes.json(),
          ]);

        const companyIdToLocation = {};
        addressesData.forEach((ad) => {
          const loc = locationsData.find((l) => l.id === ad.location_id);
          companyIdToLocation[ad.company_id] = loc ? loc.name : undefined;
        });

        const companyIdToJobCount = {};
        jobsData.forEach((j) => {
          companyIdToJobCount[j.company_id] =
            (companyIdToJobCount[j.company_id] || 0) + 1;
        });

        const normalized = (companiesData || []).map((c) => ({
          id: c.id,
          name: c.name,
          logo: c.logo,
          location: companyIdToLocation[c.id],
          follower: c.follower,
          website: c.website,
          jobCount: companyIdToJobCount[c.id] || 0,
        }));

        setCompanies(normalized.slice(0, 6));
      } catch (error) {
        console.error('FeaturedCompanies fetch error:', error);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mockCompanies = React.useMemo(
    () =>
      Array.from({ length: 6 }).map((_, i) => ({
        id: `mc${i + 1}`,
        name: "Dribbble",
        location: "Dhaka, Bangladesh",
        jobCount: 3,
      })),
    []
  );

  return (
    <div className="fc-wrapper">
      <div className="fc-header">
        <h2 className="fc-title">Công ty nổi bật</h2>
        <Button type="link" className="fc-view-more" onClick={() => navigate("/companies")}>
          Xem Thêm <ArrowRightOutlined />
        </Button>
      </div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <Spin />
        </div>
      ) : companies.length === 0 ? (
        <Row gutter={[24, 24]}>
          {mockCompanies.map((c) => (
            <Col xs={24} sm={12} md={12} lg={8} key={c.id}>
              <Card hoverable className="fc-card">
                <div className="fc-top">
                  <div className="fc-logo">🏀</div>
                  <div className="fc-top-info">
                    <div className="fc-name">{c.name}</div>
                    <span className="fc-chip">Featured</span>
                  </div>
                </div>
                <div className="fc-location">
                  <EnvironmentOutlined /> {c.location}
                </div>
                <Button className="fc-button" block>Open Position ({c.jobCount})</Button>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[24, 24]}>
          {companies.map((c) => (
            <Col xs={24} sm={12} md={12} lg={8} key={c.id}>
              <Card hoverable className="fc-card">
                <div className="fc-top">
                  <Avatar src={c.logo} size={44} shape="square" className="fc-logo-avatar" />
                  <div className="fc-top-info">
                    <div className="fc-name">{c.name}</div>
                    <span className="fc-chip">Featured</span>
                  </div>
                </div>
                <div className="fc-location">
                  <EnvironmentOutlined /> {c.location || "Đang cập nhật"}
                </div>
                <Button className="fc-button" block>Open Position ({c.jobCount})</Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default FeaturedCompanies;
