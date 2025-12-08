import React from "react";
import { Card, Tag, Row, Col, Spin, Empty, Button } from "antd";
import {
  EnvironmentOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import { useSearchParams } from "react-router-dom";
import { getCookie } from "../../helpers/cookie";
import { getAlljob } from "../../services/jobServices/jobServices";
function JobsPage() {
  const [jobs, setJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [savedIds, setSavedIds] = React.useState([]);
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        // Đọc query parameters từ URL
        const city = searchParams.get("city") || "";
        const keyword = searchParams.get("keyword") || "";
        const position = searchParams.get("position") || "";

        // Gửi params vào API
        const params = {};
        if (city) params.city = city;
        if (keyword) params.keyword = keyword;
        if (position) params.position = position;

        const data = await getAlljob(params);
        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [searchParams]);

  // Load saved jobs from localStorage
  React.useEffect(() => {
    const userId = getCookie("id");
    const parseArr = (raw) => {
      try {
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    };
    const globalIds = parseArr(localStorage.getItem("saved_jobs"));
    const userIds = userId
      ? parseArr(localStorage.getItem(`saved_jobs_${userId}`))
      : [];
    setSavedIds([...globalIds, ...userIds]);
  }, []);

  const toggleSave = (jobId) => {
    if (!jobId) return;
    const userId = getCookie("id");
    const keys = ["saved_jobs"];
    if (userId) keys.push(`saved_jobs_${userId}`);

    const nextIds = new Set(savedIds);
    if (nextIds.has(jobId)) {
      nextIds.delete(jobId);
    } else {
      nextIds.add(jobId);
    }

    const updateKey = (key) => {
      try {
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : [];
        const arr = Array.isArray(parsed) ? parsed : [];
        const exists = arr.some((id) => String(id) === String(jobId));
        const next = exists
          ? arr.filter((id) => String(id) !== String(jobId))
          : [...arr, jobId];
        localStorage.setItem(key, JSON.stringify(next));
      } catch {}
    };
    keys.forEach(updateKey);
    setSavedIds([...nextIds]);
  };

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
                style={{ position: "relative" }}
                hoverable
                onClick={() => (window.location.href = `/jobs/${job.id}`)}
              >
                <Button
                  type="text"
                  aria-label={
                    savedIds.some((id) => String(id) === String(job.id))
                      ? "Bo luu cong viec"
                      : "Luu cong viec"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSave(job.id);
                  }}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "1px solid #d9d9d9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                  }}
                  icon={
                    savedIds.some((id) => String(id) === String(job.id)) ? (
                      <StarFilled style={{ color: "#52c41a" }} />
                    ) : (
                      <StarOutlined style={{ color: "#bfbfbf" }} />
                    )
                  }
                />
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
