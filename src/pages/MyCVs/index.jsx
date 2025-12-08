import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  message,
  Empty,
  Modal,
  Input,
  Tag,
  Space,
  Tooltip,
} from "antd";
import {
  FileTextOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getMyCVs, deleteCV } from "../../services/CVs/cvsServices";
import { getCookie } from "../../helpers/cookie";
import dayjs from "dayjs";
import "./style.css";

const { Title, Text } = Typography;

function MyCVsPage() {
  const navigate = useNavigate();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getCookie("token") || localStorage.getItem("token");
    if (!token) {
      message.error("Vui lòng đăng nhập để xem CV");
      navigate("/login");
      return;
    }

    fetchCVs();
  }, [navigate]);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const data = await getMyCVs();
      setCvs(data || []);
    } catch (error) {
      console.error("Error fetching CVs:", error);
      message.error("Không thể tải danh sách CV");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cvId, cvTitle) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa CV "${cvTitle}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteCV(cvId);
          message.success("Đã xóa CV thành công");
          fetchCVs();
        } catch (error) {
          console.error("Error deleting CV:", error);
          message.error("Không thể xóa CV");
        }
      },
    });
  };

  const handleViewCV = (cvId) => {
    navigate(`/cv/view/${cvId}`);
  };

  const handleDownloadPDF = (cvId) => {
    navigate(`/cv/view/${cvId}`);
  };

  return (
    <div className="my-cvs-page">
      <div className="my-cvs-container">
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>Danh Sách CV Của Tôi</Title>
          <Text type="secondary">Quản lý và xem tất cả CV bạn đã tạo</Text>
        </div>

        <div
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/cv")}
            size="large"
          >
            Tạo CV Mới
          </Button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "50px" }}>
            <Text>Đang tải...</Text>
          </div>
        ) : cvs.length === 0 ? (
          <Card>
            <Empty
              description="Bạn chưa có CV nào. Hãy tạo CV đầu tiên!"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => navigate("/cv")}
              >
                Tạo CV Mới
              </Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[16, 16]}>
            {cvs.map((cv) => (
              <Col xs={24} sm={12} md={8} lg={6} key={cv.id}>
                <Card
                  className="cv-card"
                  hoverable
                  cover={
                    <div className="cv-card-cover">
                      <FileTextOutlined
                        style={{ fontSize: 48, color: "#c41e3a" }}
                      />
                    </div>
                  }
                  actions={[
                    <Tooltip title="Xem CV">
                      <EyeOutlined
                        key="view"
                        onClick={() => handleViewCV(cv.id)}
                        style={{ fontSize: 18 }}
                      />
                    </Tooltip>,
                    <Tooltip title="Tải PDF">
                      <DownloadOutlined
                        key="download"
                        onClick={() => handleDownloadPDF(cv.id)}
                        style={{ fontSize: 18 }}
                      />
                    </Tooltip>,
                    <Tooltip title="Xóa">
                      <DeleteOutlined
                        key="delete"
                        onClick={() => handleDelete(cv.id, cv.title)}
                        style={{ fontSize: 18, color: "#ff4d4f" }}
                      />
                    </Tooltip>,
                  ]}
                >
                  <Card.Meta
                    title={
                      <div>
                        <Text strong style={{ fontSize: 16 }}>
                          {cv.title}
                        </Text>
                        {cv.isDefault && (
                          <Tag color="red" style={{ marginLeft: 8 }}>
                            Mặc định
                          </Tag>
                        )}
                      </div>
                    }
                    description={
                      <div>
                        {cv.position && (
                          <div style={{ marginTop: 8 }}>
                            <Text type="secondary">Vị trí: </Text>
                            <Text>{cv.position}</Text>
                          </div>
                        )}
                        {cv.summary && (
                          <div style={{ marginTop: 8 }}>
                            <Text
                              type="secondary"
                              ellipsis={{ tooltip: cv.summary }}
                            >
                              {cv.summary.length > 50
                                ? `${cv.summary.substring(0, 50)}...`
                                : cv.summary}
                            </Text>
                          </div>
                        )}
                        <div
                          style={{ marginTop: 8, fontSize: 12, color: "#999" }}
                        >
                          {dayjs(cv.created_at).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default MyCVsPage;
