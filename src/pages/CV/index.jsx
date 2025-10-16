import React, { useEffect, useState } from "react";
import { Card, Row, Col, Typography, Button, message, Modal, Input, Form } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getCookie } from "../../helpers/cookie";
import { getDetailCandidates } from "../../services/Candidates/candidatesServices";
import { useNavigate } from "react-router-dom";
import "./style.css";

const { Title, Text } = Typography;
const { TextArea } = Input;

function CVPage() {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchCandidateData = async () => {
      const candidateId = getCookie("id");
      const token = getCookie("token");

      if (!token || !candidateId) {
        message.error("Vui lòng đăng nhập để xem CV");
        navigate("/login");
        return;
      }

      try {
        const data = await getDetailCandidates(candidateId);
        setCandidate(data);
      } catch (error) {
        message.error("Không thể tải thông tin CV");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidateData();
  }, [navigate]);

  const showModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    console.log("Form values:", values);
    message.success("Đã thêm thông tin thành công!");
    setIsModalOpen(false);
    form.resetFields();
  };

  if (loading) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Đang tải...</div>;
  }

  if (!candidate) {
    return <div style={{ padding: "50px", textAlign: "center" }}>Không tìm thấy thông tin</div>;
  }

  return (
    <div className="cv-page">
      <div className="cv-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Text>Trang chủ / CV của bạn</Text>
        </div>

        <Row gutter={24}>
          {/* Left Sidebar */}
          <Col xs={24} md={8}>
            <Card className="sidebar-card">
              <Title level={4}>Nâng cấp hồ sơ xin việc của bạn bằng việc bổ sung các trường sau</Title>
              
              <div className="action-item" onClick={() => showModal("intro")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Thêm giới thiệu bản thân</Text>
              </div>

              <div className="action-item" onClick={() => showModal("intro")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Thêm giới thiệu bản thân</Text>
              </div>

              <div className="action-item" onClick={() => showModal("intro")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Thêm giới thiệu bản thân</Text>
              </div>

              <div className="action-item" onClick={() => showModal("intro")}>
                <PlusOutlined style={{ color: "#c41e3a" }} />
                <Text>Thêm giới thiệu bản thân</Text>
              </div>

              <div className="action-item">
                <Text>Thêm thông tin khác</Text>
              </div>

              <Button type="primary" danger block size="large" style={{ marginTop: 20 }}>
                Xem Và Tải CV
              </Button>
            </Card>
          </Col>

          {/* Main Content */}
          <Col xs={24} md={16}>
            {/* Profile Card */}
            <Card className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar">
                  <img src="/src/assets/logologin.png" alt="Avatar" />
                  <Text className="company-label">Software</Text>
                </div>
                <div className="profile-info">
                  <Title level={3}>{candidate.fullName || candidate.name || "Chưa cập nhật"}</Title>
                  <Text className="profile-position">Full-Stack Developer</Text>
                  <Row gutter={[16, 8]} style={{ marginTop: 10 }}>
                    <Col span={12}>
                      <Text>📧 {candidate.email}</Text>
                    </Col>
                    <Col span={12}>
                      <Text>📞 {candidate.phone || "Chưa cập nhật"}</Text>
                    </Col>
                    <Col span={12}>
                      <Text>📅 {candidate.dob || "Chưa cập nhật"}</Text>
                    </Col>
                    <Col span={12}>
                      <Text>👤 {candidate.gender === 1 ? "Nam" : candidate.gender === 0 ? "Nữ" : "Chưa cập nhật"}</Text>
                    </Col>
                    <Col span={12}>
                      <Text>📍 {candidate.address || "Chưa cập nhật"}</Text>
                    </Col>
                    <Col span={12}>
                      <Text>🏢 {candidate.isOpen === 1 ? "Đang tìm việc" : "Không tìm việc"}</Text>
                    </Col>
                  </Row>
                </div>
                <EditOutlined className="edit-icon" />
              </div>
            </Card>

            {/* Giới Thiệu Bản Thân */}
            <Card className="section-card">
              <div className="section-header">
                <Title level={4}>Giới Thiệu Bản Thân</Title>
                <PlusOutlined className="add-icon" onClick={() => showModal("intro")} />
              </div>
              <Text className="section-description">
                Giới thiệu điểm mạnh của bản thân và kinh nghiệm của bạn
              </Text>
            </Card>

            {/* Học Vấn */}
            <Card className="section-card">
              <div className="section-header">
                <Title level={4}>Học Vấn</Title>
                <PlusOutlined className="add-icon" onClick={() => showModal("education")} />
              </div>
              <Text className="section-description">
                Giới thiệu điểm mạnh của bản thân và kinh nghiệm của bạn
              </Text>
            </Card>

            {/* Kinh Nghiệm Làm Việc */}
            <Card className="section-card">
              <div className="section-header">
                <Title level={4}>Kinh Nghiệm Làm Việc</Title>
                <PlusOutlined className="add-icon" onClick={() => showModal("experience")} />
              </div>
              <Text className="section-description">
                Giới thiệu điểm mạnh của bản thân và kinh nghiệm của bạn
              </Text>
            </Card>

            {/* Kinh Nghiệm Làm Việc 2 */}
            <Card className="section-card">
              <div className="section-header">
                <Title level={4}>Kinh Nghiệm Làm Việc</Title>
                <EditOutlined className="edit-icon" />
              </div>
              <Text className="section-description">
                Giới thiệu điểm mạnh của bản thân và kinh nghiệm của bạn
              </Text>
            </Card>

            {/* Dự Án Cá Nhân */}
            <Card className="section-card">
              <div className="section-header">
                <Title level={4}>Dự Án Cá Nhân</Title>
                <div>
                  <EditOutlined className="edit-icon" style={{ marginRight: 10 }} />
                  <DeleteOutlined className="delete-icon" />
                </div>
              </div>
              <Text className="section-description">Hiện tại</Text>
            </Card>

            {/* Chứng Chỉ */}
            <Card className="section-card">
              <div className="section-header">
                <Title level={4}>Chứng Chỉ</Title>
                <PlusOutlined className="add-icon" onClick={() => showModal("certificate")} />
              </div>
              <Text className="section-description">
                Bổ sung chứng chỉ tiêu chuẩn để nâng cao năng lực của bạn
              </Text>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Modal */}
      <Modal
        title="Giới thiệu về bản thân"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Text type="secondary">Mô tả về bản thân, các kĩ năng của mình...</Text>
          <Form.Item name="content" style={{ marginTop: 10 }}>
            <TextArea rows={6} placeholder="Hint text" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button onClick={handleCancel} style={{ marginRight: 10 }}>
              Hủy Bỏ
            </Button>
            <Button type="primary" danger htmlType="submit">
              Cập Nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CVPage;
