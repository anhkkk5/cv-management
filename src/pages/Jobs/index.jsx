import React from "react";
import { Card, Tag, Row, Col, Spin, Empty } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

function JobsPage() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:3002/Jobs");
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (e) {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Danh sách công việc</h2>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <Spin />
        </div>
      ) : jobs.length === 0 ? (
        <Empty description="Không có dữ liệu" />
      ) : (
        <Row gutter={[16, 16]}>
          {jobs.map((job) => (
            <Col xs={24} sm={12} md={12} lg={8} key={job.id}>
              <Card
                hoverable
                onClick={() => (window.location.href = `/jobs/${job.id}`)}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  {job.type ? (
                    <Tag
                      color={
                        job.type === "FULL-TIME"
                          ? "green"
                          : job.type === "PART-TIME"
                          ? "blue"
                          : "orange"
                      }
                    >
                      {job.type}
                    </Tag>
                  ) : null}
                  {job.salary ? <span>Salary: {job.salary}</span> : null}
                </div>
                <h3 style={{ marginTop: 0 }}>{job.title || job.name}</h3>
                <div style={{ color: "#666", marginBottom: 8 }}>
                  {job.company}
                </div>
                <div style={{ color: "#666" }}>
                  <EnvironmentOutlined /> {job.location}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default JobsPage;
