import React from "react";
import { Card, Button, Row, Col, Spin, Empty, Avatar, Typography } from "antd";
import {
  EnvironmentOutlined,
  ArrowRightOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAlljob } from "../../services/jobServices/jobServices";
import "./style.css";

function FeaturedJobs() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const data = await getAlljob();
        if (Array.isArray(data) && data.length) {
          setJobs(data.slice(0, 12));
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const badgeClass = (type) => {
    switch (type) {
      case "FULL-TIME":
        return "full";
      case "PART-TIME":
        return "part";
      case "INTERNSHIP":
        return "intern";
      default:
        return "full";
    }
  };

  return (
    <div className="fj-wrapper">
      <div className="fj-header">
        <h2 className="fj-title">Công việc nổi bật</h2>
        <Button
          type="link"
          className="fj-view-more"
          onClick={() => navigate("/jobs")}
        >
          Xem Thêm <ArrowRightOutlined />
        </Button>
      </div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
          <Spin />
        </div>
      ) : jobs.length === 0 ? (
        <Row gutter={[24, 24]}>
          {jobs.map((job) => (
            <Col xs={24} sm={12} md={12} lg={8} key={job.id}>
              <Card hoverable className="fj-card">
                <div className="fj-card-top">
                  <Typography.Title level={4} className="fj-job-title">
                    {job.title}
                  </Typography.Title>
                  <StarOutlined className="fj-bookmark" />
                </div>

                <div className="fj-meta-line">
                  <span className={`fj-badge ${badgeClass(job.type)}`}>
                    {job.type}
                  </span>
                  <span className="fj-salary">Salary: {job.salary}</span>
                </div>

                <div className="fj-company">
                  <Avatar size={40} className="fj-avatar">
                    G
                  </Avatar>
                  <div className="fj-company-info">
                    <div className="fj-company-name">{job.company}</div>
                    <div className="fj-location">
                      <EnvironmentOutlined /> {job.location}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[24, 24]}>
          {jobs.map((job) => (
            <Col xs={24} sm={12} md={12} lg={8} key={job.id}>
              <Card
                hoverable
                className="fj-card"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="fj-card-top">
                  <Typography.Title level={4} className="fj-job-title">
                    {job.title || job.name}
                  </Typography.Title>
                  <StarOutlined className="fj-bookmark" />
                </div>

                <div className="fj-meta-line">
                  {job.type ? (
                    <span className={`fj-badge ${badgeClass(job.type)}`}>
                      {job.type}
                    </span>
                  ) : null}
                  {job.salary ? (
                    <span className="fj-salary">Salary: {job.salary}</span>
                  ) : null}
                </div>

                <div className="fj-company">
                  <Avatar size={40} className="fj-avatar">
                    {(job.company || "?").charAt(0)}
                  </Avatar>
                  <div className="fj-company-info">
                    <div className="fj-company-name">{job.company}</div>
                    <div className="fj-location">
                      <EnvironmentOutlined /> {job.location}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default FeaturedJobs;
