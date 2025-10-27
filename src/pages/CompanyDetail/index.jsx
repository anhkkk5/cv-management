import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCookie } from "../../helpers/cookie";
import {
  Card,
  Row,
  Col,
  Tag,
  Spin,
  Empty,
  Avatar,
  Button,
  Typography,
  Breadcrumb,
  Input,
  Space,
  Modal,
  Form,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  GlobalOutlined,
  HeartOutlined,
  HeartFilled,
  LinkOutlined,
  SearchOutlined,
  FilterOutlined,
  LinkedinOutlined,
  FacebookOutlined,
  TwitterOutlined,
  MailOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  getDetaiCompany,
  getAllCompany,
  editCompany,
} from "../../services/getAllCompany/companyServices";
import { getListJob } from "../../services/jobServices/jobServices";
import "./style.css";

const { Title, Paragraph } = Typography;
const { Search, TextArea } = Input;

function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = React.useState(null);
  const [jobs, setJobs] = React.useState([]);
  const [relatedCompanies, setRelatedCompanies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [jobsLoading, setJobsLoading] = React.useState(false);
  const [companiesLoading, setCompaniesLoading] = React.useState(false);
  const [userType, setUserType] = React.useState("");
  const [currentUserId, setCurrentUserId] = React.useState("");
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  React.useEffect(() => {
    // Check user type from cookie
    const type = getCookie("userType");
    const userId = getCookie("id");
    setUserType(type || "");
    setCurrentUserId(userId || "");
  }, []);

  React.useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        console.log("Fetching company with ID:", id);
        const data = await getDetaiCompany(id);
        console.log("Company data received:", data);
        setCompany(data);
      } catch (error) {
        console.error("Error fetching company:", error);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        const data = await getListJob(id);
        setJobs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    };

    const fetchRelatedCompanies = async () => {
      try {
        setCompaniesLoading(true);
        const allCompanies = await getAllCompany();
        // Filter out current company and get 6 related companies
        const filtered = allCompanies
          .filter((comp) => comp.id !== id)
          .slice(0, 6);
        setRelatedCompanies(filtered);
      } catch (error) {
        console.error("Error fetching related companies:", error);
        setRelatedCompanies([]);
      } finally {
        setCompaniesLoading(false);
      }
    };

    if (id) {
      fetchCompany();
      fetchJobs();
      fetchRelatedCompanies();
    }
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success("Đã sao chép link!");
  };

  const handleEditClick = () => {
    if (company) {
      form.setFieldsValue({
        companyName: company.companyName || company.name,
        website: company.website,
        address: company.address,
        description: company.description,
        logo: company.logo,
      });
      setEditModalVisible(true);
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      const updateData = {
        companyName: values.companyName,
        name: values.companyName,
        website: values.website,
        address: values.address,
        description: values.description,
        logo: values.logo,
        updated_at: new Date().toISOString().split('T')[0],
      };

      await editCompany(id, updateData);
      message.success("Cập nhật thông tin công ty thành công!");
      setEditModalVisible(false);
      
      // Refresh company data
      const updatedData = await getDetaiCompany(id);
      setCompany(updatedData);
    } catch (error) {
      console.error("Error updating company:", error);
      message.error("Cập nhật thông tin công ty thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
    form.resetFields();
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!company) {
    return <Empty description="Không tìm thấy thông tin công ty" />;
  }

  return (
    <div className="company-detail">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>
          <a href="/">Trang chủ</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a href="/companies">Thông tin doanh nghiệp</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{company.fullName}</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[24, 24]}>
        {/* Main Content */}
        <Col xs={24} lg={16}>
          {/* Company Header */}
          <Card className="company-header-card">
            <div className="company-header">
              <div className="company-logo-section">
                <Avatar
                  src={company.logo}
                  size={80}
                  shape="square"
                  className="company-logo"
                >
                  {company.fullName?.charAt(0)}
                </Avatar>
                <div className="company-info">
                  <Title level={2} className="company-name">
                    {company.fullName}
                  </Title>
                  <div className="company-tags">
                    <Tag color="green">Outsource</Tag>
                    <Tag color="blue">verified</Tag>
                  </div>
                  <div className="company-website">
                    <LinkOutlined />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {company.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Company Description */}
          <Card title="Mô tả về công ty" className="description-card">
            <Paragraph>{company.description}</Paragraph>
          </Card>

          {/* Policies/Requirements */}
          <Card title="Chính sách" className="policies-card">
            <ul className="policies-list">
              <li>Great troubleshooting and analytical skills</li>
              <li>
                3+ years of experience in back-end development (multiple smaller
                projects or large-scale applications)
              </li>
              <li>
                Experience with HTML, JavaScript, CSS, PHP, Symphony, and/or
                Laravel
              </li>
              <li>
                Regularly working with APIs and Web Services (REST, GraphQL,
                SOAP, etc.)
              </li>
              <li>
                Experience/awareness in Agile application development,
                commercial off-the-shelf software, middleware, servers and
                storage, and database management
              </li>
              <li>
                Familiarity with version control and project management systems
                (e.g., Github, Jira)
              </li>
              <li>
                Ambitious and hungry to grow a career in a fast-growing agency
              </li>
            </ul>
          </Card>

          {/* Open Jobs */}
          <Card 
            title="Việc làm đang mở" 
            className="jobs-card"
            extra={
              userType === "company" && currentUserId === id ? (
                <Button 
                  type="primary" 
                  danger
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/create-job')}
                  className="add-job-btn"
                >
                  Thêm việc làm mới
                </Button>
              ) : null
            }
          >
            <div className="job-search-section">
              <Space.Compact style={{ width: "100%", marginBottom: 16 }}>
                <Search
                  placeholder="Search job..."
                  prefix={<SearchOutlined />}
                  style={{ flex: 1 }}
                />
                <Input
                  placeholder="Vị trí"
                  prefix={<EnvironmentOutlined />}
                  style={{ width: 200 }}
                />
                <Button icon={<FilterOutlined />}>Filters</Button>
                <Button type="primary" danger>
                  Find Job
                </Button>
              </Space.Compact>
            </div>

            {jobsLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <Spin />
              </div>
            ) : jobs.length === 0 ? (
              <Empty description="Không có việc làm nào" />
            ) : (
              <div className="jobs-list">
                {jobs.map((job) => (
                  <Card
                    key={job.id}
                    className="job-item-card"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <div className="job-item">
                      <div className="job-content">
                        <Title level={4} className="job-title">
                          {job.title}
                        </Title>
                        <div className="job-meta">
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
                          <span className="job-salary">
                            Salary: {job.salary}
                          </span>
                        </div>
                        <div className="job-company">
                          <Avatar size={32} className="job-company-logo">
                            {company.name?.charAt(0)}
                          </Avatar>
                          <span className="job-company-name">
                            {company.name}
                          </span>
                        </div>
                        <div className="job-location">
                          <EnvironmentOutlined /> {job.location}
                        </div>
                      </div>
                      <Button className="bookmark-btn" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          {/* Related Companies */}
          <Card
            title="Công ty cùng lĩnh vực"
            className="related-companies-card"
          >
            {companiesLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 20,
                }}
              >
                <Spin />
              </div>
            ) : relatedCompanies.length === 0 ? (
              <Empty description="Không có công ty liên quan" />
            ) : (
              <Row gutter={[16, 16]}>
                {relatedCompanies.map((relatedCompany) => (
                  <Col xs={24} sm={12} md={8} key={relatedCompany.id}>
                    <Card
                      hoverable
                      className="related-company-card"
                      onClick={() =>
                        navigate(`/companies/${relatedCompany.id}`)
                      }
                    >
                      <div className="related-company-content">
                        <div className="related-company-header">
                          <Avatar
                            src={relatedCompany.logo}
                            size={40}
                            shape="square"
                            className="related-company-logo"
                          >
                            {relatedCompany.fullName?.charAt(0)}
                          </Avatar>
                          <div className="related-company-info">
                            <div className="related-company-name">
                              {relatedCompany.fullName}
                            </div>
                            <Tag
                              color="red-inverse"
                              className="related-company-tag"
                            >
                              Featured
                            </Tag>
                          </div>
                        </div>
                        <div className="related-company-location">
                          <EnvironmentOutlined /> {relatedCompany.address}
                        </div>
                        <Button
                          block
                          className="related-company-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/companies/${relatedCompany.id}`);
                          }}
                        >
                          Open Position (0)
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          {/* Action Buttons - Show based on user type */}
          {userType === "company" && currentUserId === id ? (
            // Show Edit button if the company is viewing their own page
            <Card className="action-card" style={{ marginBottom: 16 }}>
              <Button 
                type="primary" 
                danger 
                block 
                size="large"
                icon={<EditOutlined />}
                onClick={handleEditClick}
              >
                Chỉnh Sửa
              </Button>
            </Card>
          ) : userType === "candidate" || userType === "" ? (
            // Show Follow and Favorite buttons for candidates or non-logged-in users
            <Card className="action-card" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: "12px" }}>
                <Button 
                  icon={isFavorite ? <HeartFilled /> : <HeartOutlined />} 
                  size="large"
                  style={{ 
                    flex: "0 0 auto",
                    color: isFavorite ? "#c41e3a" : "inherit",
                    borderColor: isFavorite ? "#c41e3a" : "inherit"
                  }}
                  onClick={() => setIsFavorite(!isFavorite)}
                />
                <Button 
                  type="primary" 
                  danger 
                  size="large"
                  style={{ flex: 1 }}
                  onClick={() => setIsFollowing(!isFollowing)}
                >
                  {isFollowing ? "Đang Theo Dõi" : "Theo Dõi Công Ty"}
                </Button>
              </div>
            </Card>
          ) : null}

          {/* Company Address */}
          <Card title="Địa chỉ công ty" className="address-card">
            <div className="address-info">
              <EnvironmentOutlined /> {company.address}
            </div>
          </Card>

          {/* Map */}
          <Card title="Xem trên Maps" className="map-card">
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.231234567890!2d106.6297!3d10.8231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ5JzIzLjIiTiAxMDbCsDM3JzQ2LjkiRQ!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Company Location"
              />
            </div>
          </Card>

          {/* Share Company */}
          <Card
            title="Chia sẻ thông tin công ty đến mọi người"
            className="share-card"
          >
            <div className="share-section">
              <Button
                icon={<LinkOutlined />}
                onClick={handleShare}
                className="copy-link-btn"
                block
              >
                Copy Links
              </Button>
              <div className="social-share">
                <Button
                  icon={<LinkedinOutlined />}
                  className="social-btn linkedin"
                />
                <Button
                  icon={<FacebookOutlined />}
                  className="social-btn facebook"
                />
                <Button
                  icon={<TwitterOutlined />}
                  className="social-btn twitter"
                />
                <Button icon={<MailOutlined />} className="social-btn email" />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Edit Company Modal */}
      <Modal
        title="Cập nhật thông tin doanh nghiệp"
        open={editModalVisible}
        onCancel={handleEditCancel}
        footer={null}
        width={600}
        centered
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          className="company-edit-form"
        >
          <Form.Item
            label="Tên công ty"
            name="companyName"
            rules={[
              { required: true, message: "Vui lòng nhập tên công ty" },
            ]}
          >
            <Input placeholder="ABC Corp" size="large" />
          </Form.Item>

          <Form.Item
            label="Website"
            name="website"
            rules={[
              { type: "url", message: "Vui lòng nhập URL hợp lệ" },
            ]}
          >
            <Input placeholder="https://abccorp.com" size="large" />
          </Form.Item>

          <Form.Item
            label="Logo (URL)"
            name="logo"
          >
            <Input placeholder="https://example.com/logo.png" size="large" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ công ty"
            name="address"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ công ty" },
            ]}
          >
            <Input placeholder="123ABC street, VN" size="large" />
          </Form.Item>

          <Form.Item
            label="Mô tả về công ty"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả về công ty" },
            ]}
          >
            <TextArea
              placeholder="Nhập mô tả về công ty..."
              rows={6}
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <Button
                size="large"
                onClick={handleEditCancel}
                disabled={submitting}
              >
                Hủy Bỏ
              </Button>
              <Button
                type="primary"
                danger
                size="large"
                htmlType="submit"
                loading={submitting}
              >
                Cập Nhật
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CompanyDetail;
