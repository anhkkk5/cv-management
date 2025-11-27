import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Table, Tag, Typography, Spin, message } from "antd";
import { StarFilled } from "@ant-design/icons";
import { getCookie } from "../../helpers/cookie";
import { getDetaiJob } from "../../services/jobServices/jobServices";

const { Title, Text } = Typography;

const statusTag = (status) => {
  if (status === "active") return <Tag color="green">Đang tuyển</Tag>;
  if (status === "closed") return <Tag color="red">Đã đóng</Tag>;
  if (status === "inactive") return <Tag>Ngừng tuyển</Tag>;
  return null;
};

function SavedJobs() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = getCookie("token") || localStorage.getItem("token");
    const userType = getCookie("userType");
    const userId = getCookie("id");
    if (!token || userType !== "candidate") {
      message.warning("Vui lòng đăng nhập bằng tài khoản ứng viên để xem danh sách đã lưu");
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        const raw = userId ? localStorage.getItem(`saved_jobs_${userId}`) : null;
        const ids = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(ids) || ids.length === 0) {
          setItems([]);
          return;
        }

        const jobs = [];
        await Promise.all(
          ids.map(async (jid) => {
            try {
              const job = await getDetaiJob(jid);
              if (job) jobs.push(job);
            } catch (_) {}
          })
        );

        const mapped = jobs.map((job) => ({
          key: job.id,
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          status: job.status,
        }));
        setItems(mapped);
      } catch (e) {
        console.error("Error loading saved jobs", e);
        message.error("Không thể tải danh sách công việc đã lưu");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [navigate]);

  const columns = [
    {
      title: "",
      dataIndex: "favorite",
      key: "favorite",
      width: 60,
      align: "center",
      render: () => <StarFilled style={{ color: "#faad14", fontSize: 18 }} />,
    },
    {
      title: "Công việc",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <span
          style={{ fontWeight: 500, cursor: "pointer" }}
          onClick={() => navigate(`/jobs/${record.id}`)}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Công ty",
      dataIndex: "company",
      key: "company",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      render: (text) => <Text>{text || "-"}</Text>,
    },
    {
      title: "Trạng thái tin tuyển dụng",
      dataIndex: "status",
      key: "status",
      render: (value) => statusTag(value),
    },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <Card bodyStyle={{ padding: 24 }}>
        <Title level={3} style={{ marginBottom: 24 }}>
          Công việc đã lưu
        </Title>
        {items.length === 0 ? (
          <Text>Hiện bạn chưa lưu công việc nào.</Text>
        ) : (
          <Table columns={columns} dataSource={items} pagination={{ pageSize: 10 }} />
        )}
      </Card>
    </div>
  );
}

export default SavedJobs;
