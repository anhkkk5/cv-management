import React from "react";
import { Row, Col, Card, Tag, Empty, Spin, Button, Space, Typography } from "antd";
import { EnvironmentOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAlljob } from "../../services/jobServices/jobServices";

const STORAGE_KEY = "saved_jobs";

const readSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_e) {
    return [];
  }
};

function SavedJobsPage() {
  const [savedData, setSavedData] = React.useState(readSaved());
  const [allJobs, setAllJobs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  // Fetch full jobs list so we can hydrate saved IDs with current data
  React.useEffect(() => {
    let mounted = true;
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const data = await getAlljob();
        if (mounted && Array.isArray(data)) {
          setAllJobs(data);
        }
      } catch (_e) {
        if (mounted) {
          setAllJobs([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchJobs();
    return () => {
      mounted = false;
    };
  }, []);

  const savedJobs = React.useMemo(() => {
    const ids = savedData
      .filter((item) => typeof item === "number" || typeof item === "string")
      .map((item) => String(item));
    const objects = savedData.filter((item) => item && typeof item === "object");

    const matchedFromIds = allJobs.filter((job) => ids.includes(String(job.id)));
    const merged = [...matchedFromIds];

    objects.forEach((obj) => {
      const alreadyHas = merged.some((job) => String(job.id) === String(obj.id));
      if (!alreadyHas) {
        merged.push(obj);
      }
    });
    return merged;
  }, [savedData, allJobs]);

  const handleRemove = (jobId) => {
    const next = savedData.filter((item) => String(item?.id ?? item) !== String(jobId));
    setSavedData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2} style={{ marginBottom: 12 }}>
        Việc làm đã lưu
      </Typography.Title>
      <Typography.Paragraph type="secondary" style={{ marginBottom: 24 }}>
        Danh sách các tin tuyển dụng bạn đã lưu lại để xem sau.
      </Typography.Paragraph>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
          <Spin />
        </div>
      ) : savedJobs.length === 0 ? (
        <Empty description="Chưa có việc làm nào được lưu" />
      ) : (
        <Row gutter={[16, 16]}>
          {savedJobs.map((job) => (
            <Col xs={24} sm={12} md={12} lg={8} key={job.id || job.title}>
              <Card
                hoverable
                onClick={() => (window.location.href = `/jobs/${job.id}`)}
                actions={[
                  <Button
                    key="remove"
                    type="text"
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(job.id);
                    }}
                  >
                    Bỏ lưu
                  </Button>,
                ]}
              >
                <Space direction="vertical" size={10} style={{ width: "100%" }}>
                  <Space size={8} wrap>
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
                    {job.salary ? <Tag color="gold">Salary: {job.salary}</Tag> : null}
                  </Space>
                  <Typography.Title level={4} style={{ margin: 0 }}>
                    {job.title || job.name || "Chưa có tiêu đề"}
                  </Typography.Title>
                  {job.company ? (
                    <Typography.Text style={{ color: "#666" }}>{job.company}</Typography.Text>
                  ) : null}
                  {job.location ? (
                    <Typography.Text style={{ color: "#666" }}>
                      <EnvironmentOutlined /> {job.location}
                    </Typography.Text>
                  ) : null}
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default SavedJobsPage;
