import React from "react";
import { Card, Row, Col, Tag, Spin, Empty, Avatar, Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

function CompaniesPage() {
  const [companies, setCompanies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

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

        setCompanies(normalized);
      } catch {
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Công ty</h2>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <Spin />
        </div>
      ) : companies.length === 0 ? (
        <Empty description="Không có dữ liệu" />
      ) : (
        <Row gutter={[16, 16]}>
          {companies.map((c) => (
            <Col xs={24} sm={12} md={12} lg={8} key={c.id}>
              <Card hoverable>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 8,
                  }}
                >
                  <Avatar src={c.logo} size={40} shape="square" />
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <h3 style={{ margin: 0 }}>{c.name}</h3>
                    <Tag color="red-inverse">Featured</Tag>
                  </div>
                </div>
                <div style={{ color: "#666", marginBottom: 12 }}>
                  <EnvironmentOutlined /> {c.location || "Đang cập nhật"}
                </div>
                <Button block>Open Position ({c.jobCount})</Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default CompaniesPage;
