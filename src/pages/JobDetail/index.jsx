import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Tag,
  Spin,
  Empty,
  Button,
  Divider,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Typography,
  Breadcrumb,
  Avatar,
  message,
} from "antd";
import {
  EnvironmentOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ApartmentOutlined,
  ProfileOutlined,
  BookOutlined,
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowRightOutlined,
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./style.css";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = React.useState(false);
  const [job, setJob] = React.useState(null);
  const [company, setCompany] = React.useState(null);
  const [locationName, setLocationName] = React.useState("");
  const [appliedCandidates, setAppliedCandidates] = React.useState([]);

  // Modal states
  const [updateModalVisible, setUpdateModalVisible] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [updateLoading, setUpdateLoading] = React.useState(false);

  // Mock data for demonstration
  const mockJob = {
    id: "J001",
    title: "Senior UX Designer",
    company_id: "COMP001",
    description: `Velstar is a Shopify Plus agency, and we partner with brands to help them grow, we also do the same with our people.

Here at Velstar, we don't just make websites, we create exceptional digital experiences that users and search engines love. Our team of specialists work hard to play hard, creating unique and memorable e-commerce solutions that produce outstanding results.

The role will involve translating project specifications into clean, test-driven, easily maintainable code. You will work with the Project, Development, and Technical Director teams throughout the build cycle and will be supported by the project management team to ensure efficient delivery of technically sound, pioneering products.

Want to work with us? You're in good company!`,
    requirements: [
      "Great troubleshooting and analytical skills combined with the desire to tackle challenges head-on",
      "3+ years of experience in back-end development working either with multiple smaller projects simultaneously or large-scale applications",
      "Experience with HTML, JavaScript, CSS, PHP, Symphony and/or Laravel",
      "Working regularly with APIs and Web Services (REST, GraphQL, SOAP, etc)",
      "Experience/awareness in Agile application development, commercial off-the-shelf software, middleware, servers and storage, and database management",
      "Familiarity with version control and project management systems (e.g., Github, Jira)",
      "Ambitious and hungry to grow your career in a fast-growing agency",
    ],
    desirable: [
      "Working knowledge of eCommerce platforms, ideally Shopify but also others e.g. Magento, WooCommerce, Visualsoft to enable seamless migrations",
      "Working knowledge of payment gateways",
      "API platform experience / Building restful APIs",
    ],
    benefits: [
      "Early finish on Fridays for our end of week catch up (4:30 finish, and drink of your choice from the bar)",
      "28 days holiday (including bank holidays) rising by 1 day per year PLUS an additional day off on your birthday",
      "Generous annual bonus",
      "Healthcare package",
      "Paid community days to volunteer for a charity of your choice",
      "£100 contribution for your own personal learning and development",
      "Free Breakfast on Mondays and free snacks in the office",
      "Access to Perkbox with numerous discounts plus free points from the company to spend as you wish",
      "Cycle 2 Work Scheme",
      "Brand new MacBook Pro",
      "Joining an agency on the cusp of exponential growth and being part of this exciting story",
    ],
    salary: "$100,000 - $120,000",
    location_id: "LOC001",
    jobType: "FULL-TIME",
    jobLevel: "Entry Level",
    experience: "$50k-80k/month",
    education: "Graduation",
    postedDate: "14 Jun, 2021",
    expireDate: "14 Aug, 2021",
    expire_at: "2025-11-30",
    created_at: "2025-09-01",
    updated_at: "2025-10-06",
  };

  const mockCompany = {
    id: "COMP001",
    name: "FPT Software",
    logo: "https://example.com/fpt-logo.png",
    description: "Công ty công nghệ hàng đầu Việt Nam",
  };

  const mockCandidates = [
    {
      id: "C001",
      name: "Nguyen Van A",
      position: "Front-end",
      experience: "Fresher",
      skills: ["REACTJS", "NODEJS"],
      language: "N2",
      location: "Ha Noi, Viet Nam",
      avatar: null,
    },
    {
      id: "C002",
      name: "Nguyen Van A",
      position: "Front-end",
      experience: "Fresher",
      skills: ["REACTJS", "NODEJS"],
      language: "N2",
      location: "Ha Noi, Viet Nam",
      avatar: null,
    },
    {
      id: "C003",
      name: "Nguyen Van A",
      position: "Front-end",
      experience: "Fresher",
      skills: ["REACTJS", "NODEJS"],
      language: "N2",
      location: "Ha Noi, Viet Nam",
      avatar: null,
    },
  ];

  React.useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      try {
        setLoading(true);

        // For demo purposes, using mock data
        // In real app, you would fetch from API
        setJob(mockJob);
        setCompany(mockCompany);
        setLocationName("Dhaka, Bangladesh");
        setAppliedCandidates(mockCandidates);

        // Populate form with current job data
        form.setFieldsValue({
          title: mockJob.title,
          jobType: mockJob.jobType,
          salary: mockJob.salary,
          level: mockJob.jobLevel,
          description: mockJob.description,
          requirements: mockJob.requirements.join("\n"),
          startDate: dayjs("2021-09-12"),
          endDate: dayjs("2021-10-12"),
        });
      } catch (e) {
        console.error("Error loading job data:", e);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, form]);

  const handleUpdateJob = async (values) => {
    try {
      setUpdateLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update job data
      const updatedJob = {
        ...job,
        title: values.title,
        jobType: values.jobType,
        salary: values.salary,
        jobLevel: values.level,
        description: values.description,
        requirements: values.requirements
          .split("\n")
          .filter((req) => req.trim()),
      };

      setJob(updatedJob);
      setUpdateModalVisible(false);
      message.success("Cập nhật thông tin công việc thành công!");
    } catch {
      message.error("Có lỗi xảy ra khi cập nhật!");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteJob = async () => {
    try {
      setUpdateLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      message.success("Xóa công việc thành công!");
      setDeleteModalVisible(false);
      navigate("/jobs");
    } catch {
      message.error("Có lỗi xảy ra khi xóa!");
    } finally {
      setUpdateLoading(false);
    }
  };

  const copyJobLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      message.success("Đã copy link công việc!");
    });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!job) {
    return <Empty description="Không tìm thấy công việc" />;
  }

  return (
    <div className="job-detail-container">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 24 }}>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Việc làm</Breadcrumb.Item>
        <Breadcrumb.Item>Graphics & Design</Breadcrumb.Item>
        <Breadcrumb.Item>Job A Details</Breadcrumb.Item>
      </Breadcrumb>

      <Row gutter={[24, 24]}>
        {/* Main Content */}
        <Col xs={24} lg={16}>
          <Card className="job-detail-card">
            {/* Job Header */}
            <div className="job-header">
              <div className="job-header-left">
                <Avatar size={60} className="company-logo">
                  {company?.name?.charAt(0)}
                </Avatar>
                <div className="job-title-section">
                  <Title level={2} className="job-title">
                    {job.title}
                  </Title>
                  <Text className="company-name">at {company?.name}</Text>
                  <div className="job-tags">
                    <Tag color="green" className="job-tag">
                      {job.jobType}
                    </Tag>
                    <Tag color="red" className="job-tag">
                      Featured
                    </Tag>
                  </div>
                </div>
              </div>
              <div className="job-action-buttons">
                <Button
                  type="primary"
                  danger
                  icon={<EditOutlined />}
                  className="update-btn"
                  onClick={() => setUpdateModalVisible(true)}
                >
                  Cập Nhật Thông Tin
                </Button>
                <Button
                  type="primary"
                  danger
                  icon={<DeleteOutlined />}
                  className="delete-btn"
                  onClick={() => setDeleteModalVisible(true)}
                >
                  Xóa Công Việc
                </Button>
              </div>
            </div>

            {/* Job Description */}
            <div className="job-section">
              <Title level={4}>Job Description</Title>
              <Paragraph className="job-description">
                {job.description}
              </Paragraph>
            </div>

            {/* Requirements */}
            <div className="job-section">
              <Title level={4}>Requirements</Title>
              <ul className="job-list">
                {job.requirements?.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Desirable */}
            <div className="job-section">
              <Title level={4}>Desirable</Title>
              <ul className="job-list">
                {job.desirable?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="job-section">
              <Title level={4}>Benefits</Title>
              <ul className="job-list">
                {job.benefits?.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <Card className="job-overview-card">
            {/* Salary */}
            <div className="salary-section">
              <Text className="salary-label">Salary (USD)</Text>
              <Title level={3} className="salary-amount">
                {job.salary}
              </Title>
              <Text className="salary-period">Yearly salary</Text>
            </div>

            {/* Location */}
            <div className="location-section">
              <Text className="location-label">Job Location</Text>
              <Text className="location-value">{locationName}</Text>
            </div>

            {/* Job Overview */}
            <div className="overview-section">
              <Title level={4}>Job Overview</Title>
              <div className="overview-item">
                <CalendarOutlined className="overview-icon" />
                <span>JOB POSTED: {job.postedDate}</span>
              </div>
              <div className="overview-item">
                <ClockCircleOutlined className="overview-icon" />
                <span>JOB EXPIRE IN: {job.expireDate}</span>
              </div>
              <div className="overview-item">
                <ApartmentOutlined className="overview-icon" />
                <span>JOB LEVEL: {job.jobLevel}</span>
              </div>

              <div className="overview-item">
                <ProfileOutlined className="overview-icon" />
                <span>EXPERIENCE: {job.experience}</span>
              </div>

              <div className="overview-item">
                <BookOutlined className="overview-icon" />
                <span>EDUCATION: {job.education}</span>
              </div>
            </div>

            {/* Share */}
            <div className="share-section">
              <Title level={4}>Share this job</Title>
              <div className="share-buttons">
                <Button
                  icon={<LinkOutlined />}
                  onClick={copyJobLink}
                  className="copy-link-btn"
                >
                  Copy Links
                </Button>
                <div className="social-buttons">
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
                  <Button
                    icon={<MailOutlined />}
                    className="social-btn email"
                  />
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Applied Candidates */}
      <div className="applied-candidates-section">
        <Title level={3}>Applied Candidates</Title>
        <Row gutter={[16, 16]}>
          {appliedCandidates.map((candidate) => (
            <Col xs={24} sm={12} md={8} key={candidate.id}>
              <Card
                hoverable
                className="candidate-card"
                onClick={() => navigate(`/candidates/${candidate.id}`)}
              >
                <div className="candidate-info">
                  <Avatar size={50} className="candidate-avatar">
                    {candidate.name.charAt(0)}
                  </Avatar>
                  <div className="candidate-details">
                    <Title level={5} className="candidate-name">
                      {candidate.name}
                    </Title>
                    <div className="candidate-tags">
                      <Tag color="green">{candidate.position}</Tag>
                      <Tag color="blue">{candidate.experience}</Tag>
                    </div>
                    <div className="candidate-skills">
                      <Text className="skills-label">Technical in use:</Text>
                      <div className="skills-tags">
                        {candidate.skills.map((skill, index) => (
                          <Tag key={index} color="green" className="skill-tag">
                            {skill}
                          </Tag>
                        ))}
                      </div>
                    </div>
                    <div className="candidate-language">
                      <Text className="language-label">Foreign Language:</Text>
                      <Tag color="orange">{candidate.language}</Tag>
                    </div>
                    <div className="candidate-location">
                      <EnvironmentOutlined className="location-icon" />
                      <Text>{candidate.location}</Text>
                    </div>
                  </div>
                  <ArrowRightOutlined className="candidate-arrow" />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Update Job Modal */}
      <Modal
        title="Cập nhật thông tin công việc"
        open={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setUpdateModalVisible(false)}>
            Hủy Bỏ
          </Button>,
          <Button
            key="update"
            type="primary"
            danger
            loading={updateLoading}
            onClick={() => form.submit()}
          >
            Cập Nhật
          </Button>,
        ]}
        className="update-modal"
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateJob}>
          <Form.Item
            name="title"
            label="Tên công việc"
            rules={[
              { required: true, message: "Vui lòng nhập tên công việc!" },
            ]}
          >
            <Input placeholder="Technical Support" />
          </Form.Item>

          <Form.Item
            name="jobType"
            label="Thời gian làm việc"
            rules={[
              { required: true, message: "Vui lòng chọn thời gian làm việc!" },
            ]}
          >
            <Select placeholder="Chọn thời gian làm việc">
              <Option value="FULL-TIME">Full-time</Option>
              <Option value="PART-TIME">Part-time</Option>
              <Option value="INTERNSHIP">Internship</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="salary"
            label="Mức lương"
            rules={[{ required: true, message: "Vui lòng nhập mức lương!" }]}
          >
            <Input placeholder="$200 - $1500" />
          </Form.Item>

          <Form.Item
            name="level"
            label="Cấp độ chuyên môn"
            rules={[{ required: true, message: "Vui lòng chọn cấp độ!" }]}
          >
            <Select placeholder="Chọn cấp độ">
              <Option value="Entry Level">Entry Level</Option>
              <Option value="Junior">Junior</Option>
              <Option value="Senior">Senior</Option>
              <Option value="Lead">Lead</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả công việc"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea rows={4} placeholder="Hint text" />
          </Form.Item>

          <Form.Item
            name="requirements"
            label="Yêu cầu của công việc"
            rules={[{ required: true, message: "Vui lòng nhập yêu cầu!" }]}
          >
            <TextArea rows={4} placeholder="Hint text" />
          </Form.Item>

          <Form.Item label="Thời gian ứng tuyển">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="startDate"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày bắt đầu!" },
                  ]}
                >
                  <DatePicker
                    placeholder="Start Date"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="endDate"
                  rules={[
                    { required: true, message: "Vui lòng chọn ngày kết thúc!" },
                  ]}
                >
                  <DatePicker
                    placeholder="End Date"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            Hủy bỏ
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            loading={updateLoading}
            onClick={handleDeleteJob}
          >
            Xác nhận
          </Button>,
        ]}
        className="delete-modal"
      >
        <p>Bạn có chắc chắn xóa công việc này?</p>
      </Modal>
    </div>
  );
}

export default JobDetail;
